import express from "express";
import {
  getHomepageSections,
  getAllHomepageSections,
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
} from "../controllers/homepageSectionController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getHomepageSections);
router.get("/all", protect, adminOnly, getAllHomepageSections);
router.post("/", protect, adminOnly, createHomepageSection);
router.put("/:id", protect, adminOnly, updateHomepageSection);
router.delete("/:id", protect, adminOnly, deleteHomepageSection);

export default router;
