import express from "express";
import { getCities, createCity } from "../controllers/cityController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getCities);
router.post("/", protect, adminOnly, createCity);

export default router;
