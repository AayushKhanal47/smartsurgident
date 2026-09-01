"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.createResource = exports.getResourceBySlug = exports.getAllResourcesAdmin = exports.getResources = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Resource_1 = __importDefault(require("../models/Resource"));
const slugify = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "catalog";
const generateUniqueSlug = async (value, excludeId) => {
    const baseSlug = slugify(value);
    let slug = baseSlug;
    let counter = 2;
    while (await Resource_1.default.exists({
        slug,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
    return slug;
};
const validateRequiredFields = (payload, res) => {
    if (!payload.title?.trim()) {
        res.status(400);
        throw new Error("Title is required");
    }
    if (!payload.fileUrl?.trim()) {
        res.status(400);
        throw new Error("PDF file is required");
    }
};
exports.getResources = (0, express_async_handler_1.default)(async (req, res) => {
    const { search } = req.query;
    const filter = {
        isPublished: true,
        fileUrl: { $exists: true, $ne: "" },
    };
    if (search)
        filter.$text = { $search: String(search) };
    const resources = await Resource_1.default.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .populate("linkedBrands", "name slug");
    res.json(resources);
});
exports.getAllResourcesAdmin = (0, express_async_handler_1.default)(async (_req, res) => {
    const resources = await Resource_1.default.find().sort({ createdAt: -1 });
    res.json(resources);
});
exports.getResourceBySlug = (0, express_async_handler_1.default)(async (req, res) => {
    const resource = await Resource_1.default.findOne({
        slug: req.params.slug,
        isPublished: true,
        fileUrl: { $exists: true, $ne: "" },
    })
        .populate("linkedProducts", "name slug")
        .populate("linkedBrands", "name slug");
    if (!resource) {
        res.status(404);
        throw new Error("Resource not found");
    }
    res.json(resource);
});
exports.createResource = (0, express_async_handler_1.default)(async (req, res) => {
    const title = String(req.body.title || "").trim();
    const summary = String(req.body.summary || "").trim();
    const coverImage = String(req.body.coverImage || "").trim();
    const fileUrl = String(req.body.fileUrl || "").trim();
    const isPublished = Boolean(req.body.isPublished);
    validateRequiredFields({ title, summary, coverImage, fileUrl }, res);
    const resource = await Resource_1.default.create({
        title,
        slug: await generateUniqueSlug(req.body.slug || title),
        summary,
        coverImage,
        fileUrl,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
    });
    res.status(201).json(resource);
});
exports.updateResource = (0, express_async_handler_1.default)(async (req, res) => {
    const existing = await Resource_1.default.findById(req.params.id);
    if (!existing) {
        res.status(404);
        throw new Error("Resource not found");
    }
    const title = String(req.body.title ?? existing.title).trim();
    const summary = String(req.body.summary ?? existing.summary).trim();
    const coverImage = String(req.body.coverImage ?? existing.coverImage).trim();
    const fileUrl = String(req.body.fileUrl ?? existing.fileUrl).trim();
    const isPublished = typeof req.body.isPublished === "boolean" ? req.body.isPublished : existing.isPublished;
    validateRequiredFields({ title, summary, coverImage, fileUrl }, res);
    const slugInput = typeof req.body.slug === "string" && req.body.slug.trim() ? req.body.slug : existing.slug;
    const nextSlug = slugInput !== existing.slug || title !== existing.title
        ? await generateUniqueSlug(slugInput || title, String(existing._id))
        : existing.slug;
    const resource = await Resource_1.default.findByIdAndUpdate(req.params.id, {
        title,
        slug: nextSlug,
        summary,
        coverImage,
        fileUrl,
        isPublished,
        publishedAt: isPublished ? existing.publishedAt || new Date() : undefined,
    }, { new: true });
    if (!resource) {
        res.status(404);
        throw new Error("Resource not found");
    }
    res.json(resource);
});
exports.deleteResource = (0, express_async_handler_1.default)(async (req, res) => {
    const resource = await Resource_1.default.findByIdAndDelete(req.params.id);
    if (!resource) {
        res.status(404);
        throw new Error("Resource not found");
    }
    res.json({ message: "Resource removed" });
});
