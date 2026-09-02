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
