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
  const { category, brand, search, limit } = req.query;
  const filter: Record<string, unknown> = { isActive: true };
  const hasSearch = typeof search === "string" && search.trim().length > 0;

  if (typeof category === "string" && category) filter.category = category;
  if (typeof brand === "string" && brand) filter.brand = brand;
  if (hasSearch) filter.$text = { $search: (search as string).trim() };

  // $meta: "textScore" is only valid alongside a $text query, so the
  // projection/sort are conditional on hasSearch — without it, results
  // returned in whatever order Mongo happens to store them, not ranked by
  // how well they actually match (search "manage the search bar" fix).
  let query = Product.find(filter, hasSearch ? { score: { $meta: "textScore" } } : undefined).populate(
    "brand",
    "name slug logoUrl"
  );
  if (hasSearch) query = query.sort({ score: { $meta: "textScore" } });

  // Optional cap — used by the navbar's live suggestions dropdown, which
  // only needs a handful of top matches, not the whole result set.
  const limitNum = typeof limit === "string" ? Number.parseInt(limit, 10) : NaN;
  if (Number.isInteger(limitNum) && limitNum > 0) query = query.limit(Math.min(limitNum, 50));

  const products = await query.lean();
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
