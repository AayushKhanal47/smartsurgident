import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Dealer from "../models/Dealer";
import { authCookieOptions, clearCookieOptions } from "../config/cookies";

const signToken = (id: string) =>
  jwt.sign({ id, type: "dealer" }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Normalizes a dealer-supplied website to a safe absolute http(s) URL, or
// undefined if blank/unparsable — callers must not persist raw user input.
const normalizeWebsite = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
};

export const createDealer = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    city,
    province,
    phone,
    whatsapp,
    website,
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
    website: normalizeWebsite(website),
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

export const loginDealer = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(401);
    throw new Error("Invalid dealer credentials");
  }

  const dealer = await Dealer.findOne({ email });

  if (!dealer || !(await bcrypt.compare(password, dealer.password))) {
    res.status(401);
    throw new Error("Invalid dealer credentials");
  }

  const token = signToken(dealer._id.toString());
  res.cookie("dealerToken", token, authCookieOptions);
  res.json({ _id: dealer._id, name: dealer.name, city: dealer.city });
});

export const logoutDealer = (_req: Request, res: Response) => {
  res.clearCookie("dealerToken", clearCookieOptions);
  res.status(204).send();
};

export const getDealers = asyncHandler(async (_req: Request, res: Response) => {
  const dealers = await Dealer.find().populate("city", "name").select("-password");
  res.json(dealers);
});

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

export const updateDealer = asyncHandler(async (req: Request, res: Response) => {
  const { password, website, ...rest } = req.body;
  const withWebsite = "website" in req.body ? { ...rest, website: normalizeWebsite(website) } : rest;
  const update = password ? { ...withWebsite, password: await bcrypt.hash(password, 10) } : withWebsite;

  const dealer = await Dealer.findByIdAndUpdate(req.params.id, update, { new: true }).select(
    "-password"
  );
  if (!dealer) {
    res.status(404);
    throw new Error("Dealer not found");
  }
  res.json(dealer);
});

export const deleteDealer = asyncHandler(async (req: Request, res: Response) => {
  const dealer = await Dealer.findByIdAndDelete(req.params.id);
  if (!dealer) {
    res.status(404);
    throw new Error("Dealer not found");
  }
  res.json({ message: "Dealer removed — that city now has no active dealer until a new one is added" });
});
