import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import FaqItem from "../models/FaqItem";

export const getFaqItems = asyncHandler(async (_req: Request, res: Response) => {
  const items = await FaqItem.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
  res.json(items);
});

export const getAllFaqItemsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const items = await FaqItem.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(items);
});

export const createFaqItem = asyncHandler(async (req: Request, res: Response) => {
  const question = String(req.body.question || "").trim();
  const answer = String(req.body.answer || "").trim();
  if (!question || !answer) {
    res.status(400);
    throw new Error("Question and answer are required");
  }
  const item = await FaqItem.create({
    question,
    answer,
    order: Number(req.body.order) || 0,
    isPublished: req.body.isPublished !== false,
  });
  res.status(201).json(item);
});

export const updateFaqItem = asyncHandler(async (req: Request, res: Response) => {
  const existing = await FaqItem.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("FAQ item not found");
  }
  const question = String(req.body.question ?? existing.question).trim();
  const answer = String(req.body.answer ?? existing.answer).trim();
  if (!question || !answer) {
    res.status(400);
    throw new Error("Question and answer are required");
  }
  const item = await FaqItem.findByIdAndUpdate(
    req.params.id,
    {
      question,
      answer,
      order: req.body.order != null ? Number(req.body.order) : existing.order,
      isPublished: typeof req.body.isPublished === "boolean" ? req.body.isPublished : existing.isPublished,
    },
    { new: true }
  );
  res.json(item);
});

export const deleteFaqItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await FaqItem.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("FAQ item not found");
  }
  res.json({ message: "FAQ item removed" });
});
