"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdf = exports.uploadImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const slugifyFileBase = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "catalog";
const uploadToCloudinary = async (req, fieldName, options) => {
    console.log("=== UPLOAD DEBUG ===");
    console.log("User:", req.user?._id, req.user?.email, req.user?.role);
    console.log("File:", req.file?.originalname, req.file?.mimetype, req.file?.size);
    if (!req.file) {
        throw new Error(`No file uploaded — send it under the field name '${fieldName}'`);
    }
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({
            folder: options.folder,
            resource_type: options.resourceType || "image",
            ...(options.publicId ? { public_id: options.publicId } : {}),
        }, (error, uploadResult) => {
            if (error) {
                console.error("=== CLOUDINARY UPLOAD ERROR ===");
                console.error(error);
                return reject(error);
            }
            if (!uploadResult) {
                return reject(new Error("Cloudinary returned no upload result"));
            }
            console.log("=== CLOUDINARY UPLOAD SUCCESS ===");
            console.log(uploadResult.secure_url);
            resolve(uploadResult);
        });
        stream.end(req.file.buffer);
    });
    return result.secure_url;
};
exports.uploadImage = (0, express_async_handler_1.default)(async (req, res) => {
    const url = await uploadToCloudinary(req, "image", {
        folder: "smart-surgident/images",
    });
    res.status(201).json({ url });
});
exports.uploadPdf = (0, express_async_handler_1.default)(async (req, res) => {
    const originalName = req.file?.originalname || "catalog.pdf";
    const extension = path_1.default.extname(originalName).toLowerCase() || ".pdf";
    const baseName = slugifyFileBase(path_1.default.basename(originalName, extension));
    const publicId = `${baseName}-${Date.now()}`;
    const url = await uploadToCloudinary(req, "pdf", {
        folder: "smart-surgident/catalog-pdfs",
        resourceType: "image",
        publicId,
    });
    res.status(201).json({ url });
});
