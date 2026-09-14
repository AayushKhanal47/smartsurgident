import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Guide from "../models/Guide";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "guide";

const generateUniqueSlug = async (value: string, excludeId?: string) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let counter = 2;
  while (await Guide.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
};

export const getGuides = asyncHandler(async (_req: Request, res: Response) => {
  const guides = await Guide.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
  res.json(guides);
});

export const getAllGuidesAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const guides = await Guide.find().sort({ publishedAt: -1 }).lean();
  res.json(guides);
});

export const getGuideBySlug = asyncHandler(async (req: Request, res: Response) => {
  const guide = await Guide.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!guide) {
    res.status(404);
    throw new Error("Guide not found");
  }
  res.json(guide);
});

export const createGuide = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title || "").trim();
  const excerpt = String(req.body.excerpt || "").trim();
  const body = String(req.body.body || "").trim();
  if (!title || !excerpt || !body) {
    res.status(400);
    throw new Error("Title, excerpt and body are required");
  }
  const guide = await Guide.create({
    title,
    slug: await generateUniqueSlug(req.body.slug || title),
    excerpt,
    body,
    relatedCategorySlug: req.body.relatedCategorySlug || undefined,
    isPublished: Boolean(req.body.isPublished),
    publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
  });
  res.status(201).json(guide);
});

export const updateGuide = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Guide.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("Guide not found");
  }
  const title = String(req.body.title ?? existing.title).trim();
  const excerpt = String(req.body.excerpt ?? existing.excerpt).trim();
  const body = String(req.body.body ?? existing.body).trim();
  if (!title || !excerpt || !body) {
    res.status(400);
    throw new Error("Title, excerpt and body are required");
  }
  const slugInput = typeof req.body.slug === "string" && req.body.slug.trim() ? req.body.slug : existing.slug;
  const nextSlug =
    slugInput !== existing.slug || title !== existing.title
      ? await generateUniqueSlug(slugInput || title, String(existing._id))
      : existing.slug;

  const guide = await Guide.findByIdAndUpdate(
    req.params.id,
    {
      title,
      slug: nextSlug,
      excerpt,
      body,
      relatedCategorySlug: req.body.relatedCategorySlug || undefined,
      isPublished: typeof req.body.isPublished === "boolean" ? req.body.isPublished : existing.isPublished,
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : existing.publishedAt,
    },
    { new: true }
  );
  res.json(guide);
});

export const deleteGuide = asyncHandler(async (req: Request, res: Response) => {
  const guide = await Guide.findByIdAndDelete(req.params.id);
  if (!guide) {
    res.status(404);
    throw new Error("Guide not found");
  }
  res.json({ message: "Guide removed" });
});
