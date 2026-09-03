import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authCookieOptions, clearCookieOptions } from "../config/cookies";

const signToken = (id: string) =>
  jwt.sign({ id, type: "user" }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

// POST /api/auth/register
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role, clinicName } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Clinic accounts start unverified — admin approves before clinicPrice applies
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role === "clinic" ? "clinic" : "customer",
    clinicName,
    isVerifiedClinic: false,
  });

  const token = signToken(user._id.toString());
  res.cookie("token", token, authCookieOptions);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerifiedClinic: user.isVerifiedClinic,
  });
});

// POST /api/auth/login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = signToken(user._id.toString());
  res.cookie("token", token, authCookieOptions);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerifiedClinic: user.isVerifiedClinic,
  });
});

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("token", clearCookieOptions);
  res.status(204).send();
};

// GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(req.user);
});

// PATCH /api/auth/verify-clinic/:userId  (admin only — approve a clinic account)
export const verifyClinic = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isVerifiedClinic = true;
  await user.save();
  res.json({ message: `${user.name}'s clinic account is now verified` });
});

// --- Admin account management (admin only — there is no public admin
// signup; the FIRST admin is still made by registering a normal account
// and flipping its role to "admin" directly in MongoDB, per project docs) ---

const MIN_PASSWORD_LENGTH = 8;

// GET /api/auth/admins
export const getAdmins = asyncHandler(async (_req: Request, res: Response) => {
  const admins = await User.find({ role: "admin" }).select("-password").sort({ createdAt: 1 });
  res.json(admins);
});

// POST /api/auth/admins
export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || typeof password !== "string") {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400);
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const admin = await User.create({ name, email, password, role: "admin" });
  res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
});

// PATCH /api/auth/admins/:id/password  (admin resets another admin's password)
export const resetAdminPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    res.status(400);
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const admin = await User.findOne({ _id: req.params.id, role: "admin" });
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  admin.password = password; // re-hashed by the pre("save") hook
  await admin.save();
  res.json({ message: `Password updated for ${admin.name}` });
});

// DELETE /api/auth/admins/:id
export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  const admin = await User.findOne({ _id: req.params.id, role: "admin" });
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount <= 1) {
    res.status(400);
    throw new Error("Cannot remove the last remaining admin account");
  }

  await admin.deleteOne();
  res.json({ message: `${admin.name} removed from admins` });
});

// PATCH /api/auth/me/password  (any logged-in user changes their own password)
export const changeMyPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    res.status(400);
    throw new Error("Current and new password are required");
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    res.status(400);
    throw new Error(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const user = await User.findById(req.user?._id);
  if (!user || !(await user.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword; // re-hashed by the pre("save") hook
  await user.save();
  res.json({ message: "Password updated" });
});
