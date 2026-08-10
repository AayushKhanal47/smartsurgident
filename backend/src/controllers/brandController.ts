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
