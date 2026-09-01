"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Category_1 = __importDefault(require("../models/Category"));
exports.getCategories = (0, express_async_handler_1.default)(async (_req, res) => {
    const categories = await Category_1.default.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
});
exports.getCategoryBySlug = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await Category_1.default.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    res.json(category);
});
exports.createCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await Category_1.default.create(req.body);
    res.status(201).json(category);
});
exports.updateCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    res.json(category);
});
exports.deleteCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await Category_1.default.findByIdAndDelete(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    res.json({ message: "Category removed" });
});
