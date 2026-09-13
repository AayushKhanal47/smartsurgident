import express from "express";
import { getSiteSettings, updateSiteSettings } from "../controllers/siteSettingsController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getSiteSettings);
router.put("/", protect, adminOnly, updateSiteSettings);

export default router;
