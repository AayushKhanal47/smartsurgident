import express from "express";
import rateLimit from "express-rate-limit";
import {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteStatus,
  deleteQuoteRequest,
} from "../controllers/quoteController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

// Turnstile alone doesn't cap volume — a solved challenge can still be
// replayed at whatever rate a script wants. Dedicated per-IP limit, same
// pattern/shape as the order limiter (security audit follow-up).
const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many quote requests from this address, please try again later." },
});

router.post("/", quoteLimiter, createQuoteRequest);
router.get("/", protect, adminOnly, getQuoteRequests);
router.patch("/:id/status", protect, adminOnly, updateQuoteStatus);
router.delete("/:id", protect, adminOnly, deleteQuoteRequest);

export default router;
