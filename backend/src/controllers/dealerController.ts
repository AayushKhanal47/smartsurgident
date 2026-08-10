import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Dealer from "../models/Dealer";

const signToken = (id: string) =>
  jwt.sign({ id, type: "dealer" }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

// POST /api/dealers  (admin only — onboard a new sub-dealer for a city)
export const createDealer = asyncHandler(async (req: Request, res: Response) => {
  const { name, city, phone, email, password } = req.body;

  const existing = await Dealer.findOne({ city });
  if (existing) {
    res.status(400);
    throw new Error("This city already has an assigned dealer");
  }

  const hashed = await bcrypt.hash(password, 10);
  const dealer = await Dealer.create({ name, city, phone, email, password: hashed });
  res.status(201).json({ _id: dealer._id, name: dealer.name, city: dealer.city });
});

// POST /api/dealers/login
export const loginDealer = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const dealer = await Dealer.findOne({ email });

  if (!dealer || !(await bcrypt.compare(password, dealer.password))) {
    res.status(401);
    throw new Error("Invalid dealer credentials");
  }

  const token = signToken(dealer._id.toString());
  res.cookie("token", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.json({ _id: dealer._id, name: dealer.name, city: dealer.city, token });
});

// GET /api/dealers  (admin only)
export const getDealers = asyncHandler(async (_req: Request, res: Response) => {
  const dealers = await Dealer.find().populate("city", "name").select("-password");
  res.json(dealers);
});
