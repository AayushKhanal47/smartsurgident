import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import JobOpening from "../models/JobOpening";

export const getJobOpenings = asyncHandler(async (_req: Request, res: Response) => {
  const openings = await JobOpening.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(openings);
});

export const getAllJobOpeningsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const openings = await JobOpening.find().sort({ createdAt: -1 });
  res.json(openings);
});

export const createJobOpening = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title || "").trim();
  const body = String(req.body.body || "").trim();
  if (!title || !body) {
    res.status(400);
    throw new Error("Title and body are required");
  }
  const opening = await JobOpening.create({
    title,
    location: String(req.body.location || "").trim(),
    employmentType: String(req.body.employmentType || "").trim(),
    body,
    isActive: req.body.isActive !== false,
  });
  res.status(201).json(opening);
});

export const updateJobOpening = asyncHandler(async (req: Request, res: Response) => {
  const existing = await JobOpening.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("Job opening not found");
  }
  const title = String(req.body.title ?? existing.title).trim();
  const body = String(req.body.body ?? existing.body).trim();
  if (!title || !body) {
    res.status(400);
    throw new Error("Title and body are required");
  }
  const opening = await JobOpening.findByIdAndUpdate(
    req.params.id,
    {
      title,
      location: req.body.location != null ? String(req.body.location).trim() : existing.location,
      employmentType:
        req.body.employmentType != null ? String(req.body.employmentType).trim() : existing.employmentType,
      body,
      isActive: typeof req.body.isActive === "boolean" ? req.body.isActive : existing.isActive,
    },
    { new: true }
  );
  res.json(opening);
});

export const deleteJobOpening = asyncHandler(async (req: Request, res: Response) => {
  const opening = await JobOpening.findByIdAndDelete(req.params.id);
  if (!opening) {
    res.status(404);
    throw new Error("Job opening not found");
  }
  res.json({ message: "Job opening removed" });
});
