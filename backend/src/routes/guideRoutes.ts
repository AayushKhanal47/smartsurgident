import express from "express";
import {
  getGuides,
  getAllGuidesAdmin,
  getGuideBySlug,
  createGuide,
  updateGuide,
  deleteGuide,
} from "../controllers/guideController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getGuides);
router.get("/admin/all", protect, adminOnly, getAllGuidesAdmin);
router.get("/:slug", getGuideBySlug);
router.post("/", protect, adminOnly, createGuide);
router.put("/:id", protect, adminOnly, updateGuide);
router.delete("/:id", protect, adminOnly, deleteGuide);

export default router;
