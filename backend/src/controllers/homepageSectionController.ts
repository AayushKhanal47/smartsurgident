import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import HomepageSection from "../models/HomepageSection";

// GET /api/homepage-sections — public, ordered, visible-only
export const getHomepageSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await HomepageSection.find({ isVisible: true }).sort({ order: 1 });
  res.json(sections);
});

// GET /api/homepage-sections/all  (admin only — includes hidden sections for editing)
export const getAllHomepageSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await HomepageSection.find().sort({ order: 1 });
  res.json(sections);
});

export const createHomepageSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.create(req.body);
  res.status(201).json(section);
});

export const updateHomepageSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
