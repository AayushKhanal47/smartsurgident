import express from "express";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../controllers/brandController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, adminOnly, createBrand);
router.put("/:id", protect, adminOnly, updateBrand);
router.delete("/:id", protect, adminOnly, deleteBrand);

export default router;
