import express from "express";
import { createDealer, loginDealer, getDealers } from "../controllers/dealerController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/login", loginDealer);
router.post("/", protect, adminOnly, createDealer);
router.get("/", protect, adminOnly, getDealers);

export default router;
