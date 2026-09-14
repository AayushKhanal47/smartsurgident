import express from "express";
import rateLimit from "express-rate-limit";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

// Turnstile alone doesn't cap volume — a solved challenge can still be
// replayed at whatever rate a script wants. Dedicated per-IP limit, same
// pattern/shape as the order limiter (security audit follow-up).
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages from this address, please try again later." },
});

router.post("/", contactLimiter, createContactMessage);
router.get("/", protect, adminOnly, getContactMessages);
router.patch("/:id/status", protect, adminOnly, updateContactMessageStatus);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

export default router;
