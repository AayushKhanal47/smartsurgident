import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ContactMessage from "../models/ContactMessage";
import { verifyTurnstileToken } from "../utils/turnstile";
import { sendEmail, getAdminNotificationEmail, escapeHtml } from "../utils/email";

// POST /api/contact  (public — the Contact Us form submits here)
export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message, turnstileToken } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name ||
    !email ||
    !message
  ) {
    res.status(400);
    throw new Error("Name, email and message are required");
  }

  if (!(await verifyTurnstileToken(turnstileToken, req.ip))) {
    res.status(400);
    throw new Error("Verification failed. Please try again.");
  }

  const contactMessage = await ContactMessage.create({ name, email, message });

  // Same gap as quotes — nothing notified admin that a message had
  // arrived, only the admin panel's Contact messages list showed it.
  await sendEmail({
    to: await getAdminNotificationEmail(),
    subject: `New contact message from ${escapeHtml(name)}`,
    html: `
      <p>A new contact form message was submitted.</p>
      <p><strong>From:</strong> ${escapeHtml(name)} — ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message)}</p>
    `,
  });

  res.status(201).json({ message: "Message received", id: contactMessage._id });
});

// GET /api/contact  (admin only)
export const getContactMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

// PATCH /api/contact/:id/status  (admin only)
export const updateContactMessageStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const contactMessage = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!contactMessage) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json(contactMessage);
});

// DELETE /api/contact/:id  (admin only)
export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!contactMessage) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ message: "Message removed" });
});
