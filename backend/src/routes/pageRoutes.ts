import express from "express";
import { getPage, getAllPagesAdmin, updatePage } from "../controllers/pageController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getAllPagesAdmin);
router.get("/:slug", getPage);
router.put("/:slug", protect, adminOnly, updatePage);

export default router;
