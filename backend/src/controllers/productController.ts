import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product";
import { pick } from "../utils/pick";

const PRODUCT_FIELDS = [
  "name", "slug", "brand", "category", "description", "specs", "images",
  "catalogResource", "price", "clinicPrice", "stock", "sku", "isActive",
  "isFeatured", "isNewArrival", "isBestSeller", "badges",
] as const;

// .lean() on this and every other read-only public query below: these
// responses are never mutated after the query returns, so there's no
// reason to pay for hydrating full Mongoose documents (change tracking,
// getters/virtuals — this app defines none) just to immediately
// JSON-serialize them (perf audit, P2 — free, correct practice; not
// measurable at the current catalogue size, but it's the right default).
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, brand, search } = req.query;
  const filter: Record<string, unknown> = { isActive: true };

  if (typeof category === "string" && category) filter.category = category;
  if (typeof brand === "string" && brand) filter.brand = brand;
  if (search) filter.$text = { $search: String(search) };

  const products = await Product.find(filter).populate("brand", "name slug logoUrl").lean();
  res.json(products);
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("brand", "name slug logoUrl description")
    .populate("catalogResource", "title slug fileUrl coverImage")
    .lean();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(pick(req.body, PRODUCT_FIELDS));
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pick(req.body, PRODUCT_FIELDS), { new: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product removed" });
});
