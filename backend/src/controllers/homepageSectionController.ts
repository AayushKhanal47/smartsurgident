import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import HomepageSection from "../models/HomepageSection";
import { pick } from "../utils/pick";

const HOMEPAGE_SECTION_FIELDS = ["type", "title", "subtitle", "config", "order", "isVisible"] as const;

// GET /api/homepage-sections — public, ordered, visible-only
export const getHomepageSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await HomepageSection.find({ isVisible: true }).sort({ order: 1 }).lean();
  res.json(sections);
});

// GET /api/homepage-sections/all  (admin only — includes hidden sections for editing)
export const getAllHomepageSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await HomepageSection.find().sort({ order: 1 }).lean();
  res.json(sections);
});

export const createHomepageSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.create(pick(req.body, HOMEPAGE_SECTION_FIELDS));
  res.status(201).json(section);
});

export const updateHomepageSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.findByIdAndUpdate(req.params.id, pick(req.body, HOMEPAGE_SECTION_FIELDS), { new: true });
  if (!section) {
    res.status(404);
    throw new Error("Homepage section not found");
  }
  res.json(section);
});

export const deleteHomepageSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.findByIdAndDelete(req.params.id);
  if (!section) {
    res.status(404);
    throw new Error("Homepage section not found");
  }
  res.json({ message: "Section removed" });
});
