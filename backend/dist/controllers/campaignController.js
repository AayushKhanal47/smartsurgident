"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignBySlug = exports.getAllCampaignsAdmin = exports.getCampaigns = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
exports.getCampaigns = (0, express_async_handler_1.default)(async (req, res) => {
    const { placement } = req.query;
    const now = new Date();
    const filter = {
        isActive: true,
        $and: [
            { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
            { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
        ],
    };
    if (placement)
        filter.placement = placement;
    const campaigns = await Campaign_1.default.find(filter).populate("products");
    res.json(campaigns);
});
exports.getAllCampaignsAdmin = (0, express_async_handler_1.default)(async (_req, res) => {
    const campaigns = await Campaign_1.default.find().sort({ createdAt: -1 }).populate("products");
    res.json(campaigns);
});
exports.getCampaignBySlug = (0, express_async_handler_1.default)(async (req, res) => {
    const campaign = await Campaign_1.default.findOne({ slug: req.params.slug, isActive: true }).populate("products");
    if (!campaign) {
        res.status(404);
        throw new Error("Campaign not found");
    }
    res.json(campaign);
});
exports.createCampaign = (0, express_async_handler_1.default)(async (req, res) => {
    const campaign = await Campaign_1.default.create(req.body);
    res.status(201).json(campaign);
});
exports.updateCampaign = (0, express_async_handler_1.default)(async (req, res) => {
    const campaign = await Campaign_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) {
        res.status(404);
        throw new Error("Campaign not found");
    }
    res.json(campaign);
});
exports.deleteCampaign = (0, express_async_handler_1.default)(async (req, res) => {
    const campaign = await Campaign_1.default.findByIdAndDelete(req.params.id);
    if (!campaign) {
        res.status(404);
        throw new Error("Campaign not found");
    }
    res.json({ message: "Campaign removed" });
});
