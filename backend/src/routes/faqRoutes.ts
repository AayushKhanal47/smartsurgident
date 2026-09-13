import express from "express";
import {
  getFaqItems,
  getAllFaqItemsAdmin,
  createFaqItem,
  updateFaqItem,
  deleteFaqItem,
} from "../controllers/faqController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getFaqItems);
router.get("/admin/all", protect, adminOnly, getAllFaqItemsAdmin);
router.post("/", protect, adminOnly, createFaqItem);
router.put("/:id", protect, adminOnly, updateFaqItem);
router.delete("/:id", protect, adminOnly, deleteFaqItem);

export default router;
