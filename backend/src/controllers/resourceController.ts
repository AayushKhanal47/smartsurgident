import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Resource from "../models/Resource";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "catalog";

const generateUniqueSlug = async (value: string, excludeId?: string) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let counter = 2;

  while (
    await Resource.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const validateRequiredFields = (
  payload: {
    title?: string;
    summary?: string;
    coverImage?: string;
    fileUrl?: string;
  },
  res: Response
) => {
  if (!payload.title?.trim()) {
    res.status(400);
    throw new Error("Title is required");
  }
  if (!payload.summary?.trim()) {
    res.status(400);
    throw new Error("Short description is required");
  }
  if (!payload.fileUrl?.trim()) {
    res.status(400);
    throw new Error("PDF file is required");
  }
};

export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  const filter: Record<string, unknown> = {
    isPublished: true,
    fileUrl: { $exists: true, $ne: "" },
  };

  if (search) filter.$text = { $search: String(search) };

  const resources = await Resource.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .populate("linkedBrands", "name slug");
  res.json(resources);
});

export const getAllResourcesAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
});

export const getResourceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.findOne({
    slug: req.params.slug,
    isPublished: true,
    fileUrl: { $exists: true, $ne: "" },
  })
    .populate("linkedProducts", "name slug")
    .populate("linkedBrands", "name slug");

  if (!resource) {
    res.status(404);
    throw new Error("Resource not found");
  }
  res.json(resource);
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title || "").trim();
  const summary = String(req.body.summary || "").trim();
  const coverImage = String(req.body.coverImage || "").trim();
  const fileUrl = String(req.body.fileUrl || "").trim();
  const isPublished = Boolean(req.body.isPublished);

  validateRequiredFields({ title, summary, coverImage, fileUrl }, res);

  const resource = await Resource.create({
    title,
    slug: await generateUniqueSlug(req.body.slug || title),
    summary,
    coverImage,
    fileUrl,
    isPublished,
    publishedAt: isPublished ? new Date() : undefined,
  });
  res.status(201).json(resource);
});

export const updateResource = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Resource.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("Resource not found");
  }

  const title = String(req.body.title ?? existing.title).trim();
  const summary = String(req.body.summary ?? existing.summary).trim();
  const coverImage = String(req.body.coverImage ?? existing.coverImage).trim();
  const fileUrl = String(req.body.fileUrl ?? existing.fileUrl).trim();
  const isPublished =
    typeof req.body.isPublished === "boolean" ? req.body.isPublished : existing.isPublished;

  validateRequiredFields({ title, summary, coverImage, fileUrl }, res);

  const slugInput =
    typeof req.body.slug === "string" && req.body.slug.trim() ? req.body.slug : existing.slug;
  const nextSlug =
    slugInput !== existing.slug || title !== existing.title
      ? await generateUniqueSlug(slugInput || title, String(existing._id))
      : existing.slug;

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      title,
      slug: nextSlug,
      summary,
      coverImage,
      fileUrl,
      isPublished,
      publishedAt: isPublished ? existing.publishedAt || new Date() : undefined,
    },
    { new: true }
  );
  if (!resource) {
    res.status(404);
    throw new Error("Resource not found");
  }
  res.json(resource);
});

export const deleteResource = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error("Resource not found");
  }
  res.json({ message: "Resource removed" });
});
