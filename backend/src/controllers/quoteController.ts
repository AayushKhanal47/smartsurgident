import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import QuoteRequest from "../models/QuoteRequest";
import { verifyTurnstileToken } from "../utils/turnstile";
import { sendEmail, getAdminNotificationEmail, escapeHtml } from "../utils/email";

// POST /api/quotes  (public — the Request a Quote form submits here)
export const createQuoteRequest = asyncHandler(async (req: Request, res: Response) => {
  const { organizationName, contactName, phone, email, items, message, turnstileToken } = req.body;

  if (!organizationName || !contactName || !phone || !items) {
    res.status(400);
    throw new Error("Organization name, contact name, phone and items are required");
  }

  if (!(await verifyTurnstileToken(turnstileToken, req.ip))) {
    res.status(400);
    throw new Error("Verification failed. Please try again.");
  }

  const quote = await QuoteRequest.create({
    organizationName,
    contactName,
    phone,
    email,
    items,
    message,
  });

  // Quote requests were previously visible only by checking Admin →
  // Quote requests — no notification fired when one actually came in.
  await sendEmail({
    to: await getAdminNotificationEmail(),
    subject: `New quote request from ${escapeHtml(organizationName)}`,
    html: `
      <p>A new quote request was submitted.</p>
      <p><strong>Organization:</strong> ${escapeHtml(organizationName)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(contactName)} — ${escapeHtml(phone)}${email ? ` — ${escapeHtml(email)}` : ""}</p>
      <p><strong>Items requested:</strong> ${escapeHtml(items)}</p>
      ${message ? `<p><strong>Message:</strong> ${escapeHtml(message)}</p>` : ""}
    `,
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

// DELETE /api/quotes/:id  (admin only)
export const deleteQuoteRequest = asyncHandler(async (req: Request, res: Response) => {
  const quote = await QuoteRequest.findByIdAndDelete(req.params.id);
  if (!quote) {
    res.status(404);
    throw new Error("Quote request not found");
  }
  res.json({ message: "Quote request removed" });
});
