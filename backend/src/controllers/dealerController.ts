import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Dealer from "../models/Dealer";

const signToken = (id: string) =>
  jwt.sign({ id, type: "dealer" }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// POST /api/dealers  (admin only — onboard a new sub-dealer for a city)
export const createDealer = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    city,
    province,
    phone,
    whatsapp,
    email,
    password,
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
  } = req.body;

  const existing = await Dealer.findOne({ city });
  if (existing) {
    res.status(400);
    throw new Error("This city already has an assigned dealer");
  }

  const hashed = await bcrypt.hash(password, 10);
  const dealer = await Dealer.create({
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

// GET /api/dealers  (admin only — includes inactive dealers and contact/login info)
export const getDealers = asyncHandler(async (_req: Request, res: Response) => {
  const dealers = await Dealer.find().populate("city", "name").select("-password");
  res.json(dealers);
});

// GET /api/dealers/public  (public — powers the Dealer Network directory)
export const getPublicDealers = asyncHandler(async (req: Request, res: Response) => {
  const { province, city } = req.query;
  const filter: Record<string, unknown> = { isActive: true };
  if (province) filter.province = province;
  if (city) filter.city = city;

  const dealers = await Dealer.find(filter)
    .populate("city", "name")
    .populate("brandsCarried", "name slug logoUrl")
    .select("-password -email -__v");
  res.json(dealers);
});

// GET /api/dealers/public/:slug  (public — dealer profile page)
export const getPublicDealerBySlug = asyncHandler(async (req: Request, res: Response) => {
  const dealer = await Dealer.findOne({ slug: req.params.slug, isActive: true })
    .populate("city", "name")
    .populate("brandsCarried", "name slug logoUrl")
    .select("-password -email -__v");

  if (!dealer) {
    res.status(404);
    throw new Error("Dealer not found");
  }
  res.json(dealer);
});
