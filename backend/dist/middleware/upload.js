"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfUpload = exports.imageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
// Files are held in memory only long enough to stream to Cloudinary —
// nothing is written to disk on the server.
const storage = multer_1.default.memoryStorage();
const createFileFilter = (allowed, message) => (_req, file, cb) => {
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(message));
    }
};
exports.imageUpload = (0, multer_1.default)({
    storage,
    fileFilter: createFileFilter(["image/jpeg", "image/png", "image/webp", "image/gif"], "Only JPEG, PNG, WEBP, or GIF images are allowed"),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});
exports.pdfUpload = (0, multer_1.default)({
    storage,
    fileFilter: createFileFilter(["application/pdf"], "Only PDF files are allowed"),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});
