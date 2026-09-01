"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyClinic = exports.getMe = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};
const signToken = (id) => jsonwebtoken_1.default.sign({ id, type: "user" }, process.env.JWT_SECRET, { expiresIn: "30d" });
// POST /api/auth/register
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password, phone, role, clinicName } = req.body;
    const exists = await User_1.default.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error("An account with this email already exists");
    }
    // Clinic accounts start unverified — admin approves before clinicPrice applies
    const user = await User_1.default.create({
        name,
        email,
        password,
        phone,
        role: role === "clinic" ? "clinic" : "customer",
        clinicName,
        isVerifiedClinic: false,
    });
    const token = signToken(user._id.toString());
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerifiedClinic: user.isVerifiedClinic,
    });
});
// POST /api/auth/login
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password");
    }
    const token = signToken(user._id.toString());
    res.cookie("token", token, cookieOptions);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerifiedClinic: user.isVerifiedClinic,
    });
});
const logoutUser = (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(204).send();
};
exports.logoutUser = logoutUser;
// GET /api/auth/me
exports.getMe = (0, express_async_handler_1.default)(async (req, res) => {
    res.json(req.user);
});
// PATCH /api/auth/verify-clinic/:userId  (admin only — approve a clinic account)
exports.verifyClinic = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await User_1.default.findById(req.params.userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    user.isVerifiedClinic = true;
    await user.save();
    res.json({ message: `${user.name}'s clinic account is now verified` });
});
