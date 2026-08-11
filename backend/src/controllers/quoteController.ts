import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import QuoteRequest from "../models/QuoteRequest";

// POST /api/quotes  (public — the Request a Quote form submits here)
export const createQuoteRequest = asyncHandler(async (req: Request, res: Response) => {
  const { organizationName, contactName, phone, email, items, message } = req.body;

  if (!organizationName || !contactName || !phone || !items) {
    res.status(400);
    throw new Error("Organization name, contact name, phone and items are required");
  }

  const quote = await QuoteRequest.create({
    organizationName,
    contactName,
    phone,
    email,
    items,
    message,
  });

  res.status(201).json({ message: "Quote request received", id: quote._id });
});

// GET /api/quotes  (admin only)
export const getQuoteRequests = asyncHandler(async (_req: Request, res: Response) => {
  const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
  res.json(quotes);
});

// PATCH /api/quotes/:id/status  (admin only)
export const updateQuoteStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const quote = await QuoteRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!quote) {
    res.status(404);
    throw new Error("Quote request not found");
  }
  res.json(quote);
});
