import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
} from "../controllers/categoryController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);

export default router;
