import express from "express";
import {
  getNewsPosts,
  getAllNewsPostsAdmin,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
} from "../controllers/newsController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getNewsPosts);
router.get("/admin/all", protect, adminOnly, getAllNewsPostsAdmin);
router.post("/", protect, adminOnly, createNewsPost);
router.put("/:id", protect, adminOnly, updateNewsPost);
router.delete("/:id", protect, adminOnly, deleteNewsPost);

export default router;
