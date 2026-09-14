import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Event from "../models/Event";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "event";

const generateUniqueSlug = async (value: string, excludeId?: string) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let counter = 2;
  while (await Event.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
};

export const getEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await Event.find({ isPublished: true }).sort({ date: 1 }).lean();
  res.json(events);
});

export const getAllEventsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const events = await Event.find().sort({ date: 1 }).lean();
  res.json(events);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title || "").trim();
  const body = String(req.body.body || "").trim();
  const date = req.body.date ? new Date(req.body.date) : null;
  if (!title || !body || !date) {
    res.status(400);
    throw new Error("Title, date and body are required");
  }
  const event = await Event.create({
    title,
    slug: await generateUniqueSlug(req.body.slug || title),
    date,
    location: String(req.body.location || "").trim(),
    body,
    isPublished: Boolean(req.body.isPublished),
  });
  res.status(201).json(event);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Event.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("Event not found");
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

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      title,
      slug: nextSlug,
      date: req.body.date ? new Date(req.body.date) : existing.date,
      location: req.body.location != null ? String(req.body.location).trim() : existing.location,
      body,
      isPublished: typeof req.body.isPublished === "boolean" ? req.body.isPublished : existing.isPublished,
    },
    { new: true }
  );
  res.json(event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ message: "Event removed" });
});
