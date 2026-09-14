import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import NewsPost from "../models/NewsPost";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "post";

const generateUniqueSlug = async (value: string, excludeId?: string) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let counter = 2;
  while (await NewsPost.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
};

export const getNewsPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await NewsPost.find({ isPublished: true }).sort({ date: -1 }).lean();
  res.json(posts);
});

export const getAllNewsPostsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await NewsPost.find().sort({ date: -1 }).lean();
  res.json(posts);
});

export const createNewsPost = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title || "").trim();
  const body = String(req.body.body || "").trim();
  if (!title || !body) {
    res.status(400);
    throw new Error("Title and body are required");
  }
  const post = await NewsPost.create({
    title,
    slug: await generateUniqueSlug(req.body.slug || title),
    date: req.body.date ? new Date(req.body.date) : new Date(),
    body,
    isPublished: Boolean(req.body.isPublished),
  });
  res.status(201).json(post);
});

export const updateNewsPost = asyncHandler(async (req: Request, res: Response) => {
  const existing = await NewsPost.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("News post not found");
  }
  const title = String(req.body.title ?? existing.title).trim();
  const body = String(req.body.body ?? existing.body).trim();
  if (!title || !body) {
    res.status(400);
    throw new Error("Title and body are required");
  }
  const slugInput = typeof req.body.slug === "string" && req.body.slug.trim() ? req.body.slug : existing.slug;
  const nextSlug =
    slugInput !== existing.slug || title !== existing.title
      ? await generateUniqueSlug(slugInput || title, String(existing._id))
      : existing.slug;

  const post = await NewsPost.findByIdAndUpdate(
    req.params.id,
    {
      title,
      slug: nextSlug,
      date: req.body.date ? new Date(req.body.date) : existing.date,
      body,
      isPublished: typeof req.body.isPublished === "boolean" ? req.body.isPublished : existing.isPublished,
    },
    { new: true }
  );
  res.json(post);
});

export const deleteNewsPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await NewsPost.findByIdAndDelete(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("News post not found");
  }
  res.json({ message: "News post removed" });
});
