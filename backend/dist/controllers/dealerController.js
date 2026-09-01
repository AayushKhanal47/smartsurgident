"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDealer = exports.updateDealer = exports.getPublicDealerBySlug = exports.getPublicDealers = exports.getDealers = exports.logoutDealer = exports.loginDealer = exports.createDealer = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Dealer_1 = __importDefault(require("../models/Dealer"));
const signToken = (id) => jsonwebtoken_1.default.sign({ id, type: "dealer" }, process.env.JWT_SECRET, { expiresIn: "30d" });
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const dealerCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};
exports.createDealer = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, city, province, phone, whatsapp, email, password, address, latitude, longitude, openingHours, description, yearsInOperation, services, brandsCarried, logo, profilePhoto, storePhotos, } = req.body;
    const existing = await Dealer_1.default.findOne({ city });
    if (existing) {
        res.status(400);
        throw new Error("This city already has an assigned dealer");
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const dealer = await Dealer_1.default.create({
        name,
        city,
        province,
        phone,
        whatsapp,
        email,
        password: hashed,
        slug: slugify(name),
        address,
        latitude,
        longitude,
        openingHours,
        description,
        yearsInOperation,
        services,
        brandsCarried,
        logo,
        profilePhoto,
        storePhotos,
    });
    res.status(201).json({ _id: dealer._id, name: dealer.name, city: dealer.city, slug: dealer.slug });
});
exports.loginDealer = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const dealer = await Dealer_1.default.findOne({ email });
    if (!dealer || !(await bcryptjs_1.default.compare(password, dealer.password))) {
        res.status(401);
        throw new Error("Invalid dealer credentials");
    }
    const token = signToken(dealer._id.toString());
    res.cookie("dealerToken", token, dealerCookieOptions);
    res.json({ _id: dealer._id, name: dealer.name, city: dealer.city });
});
const logoutDealer = (_req, res) => {
    res.clearCookie("dealerToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(204).send();
};
exports.logoutDealer = logoutDealer;
exports.getDealers = (0, express_async_handler_1.default)(async (_req, res) => {
    const dealers = await Dealer_1.default.find().populate("city", "name").select("-password");
    res.json(dealers);
});
exports.getPublicDealers = (0, express_async_handler_1.default)(async (req, res) => {
    const { province, city } = req.query;
    const filter = { isActive: true };
    if (province)
        filter.province = province;
    if (city)
        filter.city = city;
    const dealers = await Dealer_1.default.find(filter)
        .populate("city", "name")
        .populate("brandsCarried", "name slug logoUrl")
        .select("-password -email -__v");
    res.json(dealers);
});
exports.getPublicDealerBySlug = (0, express_async_handler_1.default)(async (req, res) => {
    const dealer = await Dealer_1.default.findOne({ slug: req.params.slug, isActive: true })
        .populate("city", "name")
        .populate("brandsCarried", "name slug logoUrl")
        .select("-password -email -__v");
    if (!dealer) {
        res.status(404);
        throw new Error("Dealer not found");
    }
    res.json(dealer);
});
exports.updateDealer = (0, express_async_handler_1.default)(async (req, res) => {
    const { password, ...rest } = req.body;
    const update = password ? { ...rest, password: await bcryptjs_1.default.hash(password, 10) } : rest;
    const dealer = await Dealer_1.default.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!dealer) {
        res.status(404);
        throw new Error("Dealer not found");
    }
    res.json(dealer);
});
exports.deleteDealer = (0, express_async_handler_1.default)(async (req, res) => {
    const dealer = await Dealer_1.default.findByIdAndDelete(req.params.id);
    if (!dealer) {
        res.status(404);
        throw new Error("Dealer not found");
    }
    res.json({ message: "Dealer removed — that city now has no active dealer until a new one is added" });
});
