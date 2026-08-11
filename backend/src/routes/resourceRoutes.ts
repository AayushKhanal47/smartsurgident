import express from "express";
import {
  getResources,
  getResourceBySlug,
  createResource,
  updateResource,
} from "../controllers/resourceController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getResources);
router.get("/:slug", getResourceBySlug);
router.post("/", protect, adminOnly, createResource);
router.put("/:id", protect, adminOnly, updateResource);

export default router;
