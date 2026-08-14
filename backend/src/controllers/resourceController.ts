import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Resource from "../models/Resource";

export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const { type, category, search } = req.query;
  const filter: Record<string, unknown> = { isPublished: true };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: String(search) };

  const resources = await Resource.find(filter)
    .sort({ publishedAt: -1 })
    .populate("linkedBrands", "name slug");
  res.json(resources);
});

export const getAllResourcesAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
});

export const getResourceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.findOne({ slug: req.params.slug, isPublished: true })
    .populate("linkedProducts", "name slug")
    .populate("linkedBrands", "name slug");

  if (!resource) {
    res.status(404);
    throw new Error("Resource not found");
  }
  res.json(resource);
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.create(req.body);
  res.status(201).json(resource);
});

export const updateResource = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
