"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrands = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Brand_1 = __importDefault(require("../models/Brand"));
exports.getBrands = (0, express_async_handler_1.default)(async (_req, res) => {
    const brands = await Brand_1.default.find();
    res.json(brands);
});
exports.createBrand = (0, express_async_handler_1.default)(async (req, res) => {
    const brand = await Brand_1.default.create(req.body);
    res.status(201).json(brand);
});
exports.updateBrand = (0, express_async_handler_1.default)(async (req, res) => {
    const brand = await Brand_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) {
        res.status(404);
        throw new Error("Brand not found");
    }
    res.json(brand);
});
exports.deleteBrand = (0, express_async_handler_1.default)(async (req, res) => {
    const brand = await Brand_1.default.findByIdAndDelete(req.params.id);
    if (!brand) {
        res.status(404);
        throw new Error("Brand not found");
    }
    res.json({ message: "Brand removed" });
});
