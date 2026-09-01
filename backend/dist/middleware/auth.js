"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealerOnly = exports.adminOnly = exports.optionalProtect = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const Dealer_1 = __importDefault(require("../models/Dealer"));
exports.protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    const token = req.cookies?.token || req.cookies?.dealerToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.type === "dealer") {
            req.dealer = await Dealer_1.default.findById(decoded.id).select("-password");
        }
        else {
            req.user = await User_1.default.findById(decoded.id).select("-password");
        }
        next();
    }
    catch (err) {
        res.status(401);
        throw new Error("Not authorized, token invalid");
    }
});
// Orders may be placed by guests, but an authenticated customer must be
// identified when applying account-specific pricing.
exports.optionalProtect = (0, express_async_handler_1.default)(async (req, _res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token)
        return next();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.type === "user") {
            req.user = await User_1.default.findById(decoded.id).select("-password");
        }
    }
    catch {
        // A guest checkout must not fail because a stale browser cookie exists.
    }
    next();
});
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        res.status(403);
        throw new Error("Admin access only");
    }
    next();
};
exports.adminOnly = adminOnly;
const dealerOnly = (req, res, next) => {
    if (!req.dealer) {
        res.status(403);
        throw new Error("Dealer access only");
    }
    next();
};
exports.dealerOnly = dealerOnly;
