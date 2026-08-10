import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product";

// GET /api/products?category=&brand=&search=
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, brand, search } = req.query;
  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (search) filter.$text = { $search: String(search) };

  const products = await Product.find(filter).populate("brand", "name slug logoUrl");
  res.json(products);
});

// GET /api/products/:slug  — full e-library detail page
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    "brand",
    "name slug logoUrl description"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// POST /api/products  (admin only)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin only)
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});
