"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
exports.getProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const { category, brand, search } = req.query;
    const filter = { isActive: true };
    if (category)
        filter.category = category;
    if (brand)
        filter.brand = brand;
    if (search)
        filter.$text = { $search: String(search) };
    const products = await Product_1.default.find(filter).populate("brand", "name slug logoUrl");
    res.json(products);
});
exports.getProductBySlug = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findOne({ slug: req.params.slug, isActive: true }).populate("brand", "name slug logoUrl description");
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json(product);
});
exports.createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.create(req.body);
    res.status(201).json(product);
});
exports.updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json(product);
});
exports.deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findByIdAndDelete(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json({ message: "Product removed" });
});
