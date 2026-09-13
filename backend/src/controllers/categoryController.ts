import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Category from "../models/Category";
import { pick } from "../utils/pick";

const CATEGORY_FIELDS = ["name", "slug", "description", "image", "isActive"] as const;

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json(categories);
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json(category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create(pick(req.body, CATEGORY_FIELDS));
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, pick(req.body, CATEGORY_FIELDS), { new: true });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ message: "Category removed" });
});
