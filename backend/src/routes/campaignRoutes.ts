import express from "express";
import {
  getCampaigns,
  getCampaignBySlug,
  getAllCampaignsAdmin,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/admin/all", protect, adminOnly, getAllCampaignsAdmin);
router.get("/:slug", getCampaignBySlug);
router.post("/", protect, adminOnly, createCampaign);
router.put("/:id", protect, adminOnly, updateCampaign);
router.delete("/:id", protect, adminOnly, deleteCampaign);

export default router;
