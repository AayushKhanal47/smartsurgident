import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Page from "../models/Page";

// Fallback copy shown until an admin actually edits a page via
// Admin → Pages — keeps these routes from ever rendering empty on a fresh
// install, without requiring a DB seed step.
const DEFAULTS: Record<string, { title: string; body: string }> = {
  about: {
    title: "About Smart Surgident",
    body:
      "Smart Surgident was started to solve a simple problem: dental and surgical clinics outside the biggest cities in Nepal often had no direct, reliable way to buy genuine equipment — and no one to call when something needed servicing after the sale. We built a distribution model around city-based dealers instead of a single storefront, so clinics across Nepal all have someone local to order from and turn to for support.\n\nToday we distribute equipment across dental chairs and units, imaging and CBCT systems, endodontic motors, handpieces, sterilization, and consumables — importing directly from manufacturers we work with, and passing that directness on as genuine products, documented specifications, and pricing clinics can actually plan around.",
  },
  facilities: {
    title: "Our Facilities",
    body:
      "Our central warehouse and office is where every piece of equipment we distribute is received, inspected, and prepared before it reaches a dealer or a clinic directly. As our dealer network grows to more cities, this facility is what keeps stock consistent and quality checks the same no matter where an order ships to.",
  },
  warranty: {
    title: "Warranty",
    body:
      "Equipment we distribute is covered by the manufacturer's standard warranty terms. Please contact us or your local dealer with your order details for warranty support or a service request.",
  },
};

const KNOWN_SLUGS = Object.keys(DEFAULTS);

export const getPage = asyncHandler(async (req: Request, res: Response) => {
  const slug = String(req.params.slug).toLowerCase();
  const page = await Page.findOne({ slug });
  if (page) {
    res.json(page);
    return;
  }
  const fallback = DEFAULTS[slug];
  if (!fallback) {
    res.status(404);
    throw new Error("Page not found");
  }
  res.json({ slug, ...fallback });
});

export const getAllPagesAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const existing = await Page.find();
  const bySlug = new Map(existing.map((p) => [p.slug, p]));
  const merged = KNOWN_SLUGS.map((slug) => bySlug.get(slug) ?? { slug, ...DEFAULTS[slug] });
  res.json(merged);
});

export const updatePage = asyncHandler(async (req: Request, res: Response) => {
  const slug = String(req.params.slug).toLowerCase();
  if (!KNOWN_SLUGS.includes(slug)) {
    res.status(400);
    throw new Error("Unknown page slug");
  }
  const title = String(req.body.title || "").trim();
  const body = String(req.body.body ?? "");
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const page = await Page.findOneAndUpdate(
    { slug },
    { slug, title, body },
    { new: true, upsert: true }
  );
  res.json(page);
});
