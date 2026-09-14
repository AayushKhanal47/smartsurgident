import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Brand from "../models/Brand";
import { pick } from "../utils/pick";

const BRAND_FIELDS = ["name", "slug", "logoUrl", "description", "heroImage", "story", "foundedInfo"] as const;

export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await Brand.find().lean();
  res.json(brands);
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.create(pick(req.body, BRAND_FIELDS));
  res.status(201).json(brand);
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, pick(req.body, BRAND_FIELDS), { new: true });
  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }
  res.json(brand);
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }
  res.json({ message: "Brand removed" });
});
