import express from "express";
import {
  getResources,
  getResourceBySlug,
  getAllResourcesAdmin,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resourceController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getResources);
router.get("/admin/all", protect, adminOnly, getAllResourcesAdmin);
router.get("/:slug", getResourceBySlug);
router.post("/", protect, adminOnly, createResource);
router.put("/:id", protect, adminOnly, updateResource);
router.delete("/:id", protect, adminOnly, deleteResource);

export default router;
