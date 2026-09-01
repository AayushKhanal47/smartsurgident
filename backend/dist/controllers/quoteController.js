"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuoteStatus = exports.getQuoteRequests = exports.createQuoteRequest = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const QuoteRequest_1 = __importDefault(require("../models/QuoteRequest"));
// POST /api/quotes  (public — the Request a Quote form submits here)
exports.createQuoteRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const { organizationName, contactName, phone, email, items, message } = req.body;
    if (!organizationName || !contactName || !phone || !items) {
        res.status(400);
        throw new Error("Organization name, contact name, phone and items are required");
    }
    const quote = await QuoteRequest_1.default.create({
        organizationName,
        contactName,
        phone,
        email,
        items,
        message,
    });
    res.status(201).json({ message: "Quote request received", id: quote._id });
});
// GET /api/quotes  (admin only)
exports.getQuoteRequests = (0, express_async_handler_1.default)(async (_req, res) => {
    const quotes = await QuoteRequest_1.default.find().sort({ createdAt: -1 });
    res.json(quotes);
});
// PATCH /api/quotes/:id/status  (admin only)
exports.updateQuoteStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { status } = req.body;
    const quote = await QuoteRequest_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!quote) {
        res.status(404);
        throw new Error("Quote request not found");
    }
    res.json(quote);
});
