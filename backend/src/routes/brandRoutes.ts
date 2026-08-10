import express from "express";
import { getBrands, createBrand } from "../controllers/brandController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, adminOnly, createBrand);

export default router;
