import express from "express";
import {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteStatus,
} from "../controllers/quoteController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/", createQuoteRequest);
router.get("/", protect, adminOnly, getQuoteRequests);
router.patch("/:id/status", protect, adminOnly, updateQuoteStatus);

export default router;
