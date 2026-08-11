import express from "express";
import {
  getCampaigns,
  getCampaignBySlug,
  createCampaign,
  updateCampaign,
} from "../controllers/campaignController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:slug", getCampaignBySlug);
router.post("/", protect, adminOnly, createCampaign);
router.put("/:id", protect, adminOnly, updateCampaign);

export default router;
