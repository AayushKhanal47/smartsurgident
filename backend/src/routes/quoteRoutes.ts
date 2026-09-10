import express from "express";
import {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteStatus,
  deleteQuoteRequest,
} from "../controllers/quoteController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/", createQuoteRequest);
router.get("/", protect, adminOnly, getQuoteRequests);
router.patch("/:id/status", protect, adminOnly, updateQuoteStatus);
router.delete("/:id", protect, adminOnly, deleteQuoteRequest);

export default router;
