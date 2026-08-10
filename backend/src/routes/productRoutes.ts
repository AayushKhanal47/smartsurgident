import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
} from "../controllers/productController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);

export default router;
