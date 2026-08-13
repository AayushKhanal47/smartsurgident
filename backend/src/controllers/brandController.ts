import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Brand from "../models/Brand";

export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await Brand.find();
  res.json(brands);
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.create(req.body);
  res.status(201).json(brand);
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
