import express from "express";
import {
  createDealer,
  loginDealer,
  logoutDealer,
  getDealers,
  getPublicDealers,
  getPublicDealerBySlug,
  updateDealer,
  deleteDealer,
} from "../controllers/dealerController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/public", getPublicDealers);
router.get("/public/:slug", getPublicDealerBySlug);

router.post("/login", loginDealer);
router.post("/logout", logoutDealer);
router.post("/", protect, adminOnly, createDealer);
router.get("/", protect, adminOnly, getDealers);
router.put("/:id", protect, adminOnly, updateDealer);
router.delete("/:id", protect, adminOnly, deleteDealer);

export default router;
