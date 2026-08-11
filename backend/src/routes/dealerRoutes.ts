import express from "express";
import {
  createDealer,
  loginDealer,
  getDealers,
  getPublicDealers,
  getPublicDealerBySlug,
} from "../controllers/dealerController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

// Public — powers the Dealer Network directory/profile pages
router.get("/public", getPublicDealers);
router.get("/public/:slug", getPublicDealerBySlug);

router.post("/login", loginDealer);
router.post("/", protect, adminOnly, createDealer);
router.get("/", protect, adminOnly, getDealers);

export default router;
