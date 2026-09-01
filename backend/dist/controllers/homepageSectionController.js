"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomepageSection = exports.updateHomepageSection = exports.createHomepageSection = exports.getAllHomepageSections = exports.getHomepageSections = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HomepageSection_1 = __importDefault(require("../models/HomepageSection"));
// GET /api/homepage-sections — public, ordered, visible-only
exports.getHomepageSections = (0, express_async_handler_1.default)(async (_req, res) => {
    const sections = await HomepageSection_1.default.find({ isVisible: true }).sort({ order: 1 });
    res.json(sections);
});
// GET /api/homepage-sections/all  (admin only — includes hidden sections for editing)
exports.getAllHomepageSections = (0, express_async_handler_1.default)(async (_req, res) => {
    const sections = await HomepageSection_1.default.find().sort({ order: 1 });
    res.json(sections);
});
exports.createHomepageSection = (0, express_async_handler_1.default)(async (req, res) => {
    const section = await HomepageSection_1.default.create(req.body);
    res.status(201).json(section);
});
exports.updateHomepageSection = (0, express_async_handler_1.default)(async (req, res) => {
    const section = await HomepageSection_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) {
        res.status(404);
        throw new Error("Homepage section not found");
    }
    res.json(section);
});
exports.deleteHomepageSection = (0, express_async_handler_1.default)(async (req, res) => {
    const section = await HomepageSection_1.default.findByIdAndDelete(req.params.id);
    if (!section) {
        res.status(404);
        throw new Error("Homepage section not found");
    }
    res.json({ message: "Section removed" });
});
