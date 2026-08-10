import express from "express";
import {
  createOrder,
  getDealerOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController";
import { protect, adminOnly, dealerOnly } from "../middleware/auth";

const router = express.Router();

// Public — anyone (guest or logged in) can place an order
router.post("/", createOrder);

// Dealer's own routed orders
router.get("/dealer", protect, dealerOnly, getDealerOrders);
router.patch("/:id/status", protect, dealerOnly, updateOrderStatus);

// Admin — see everything across all cities
router.get("/", protect, adminOnly, getAllOrders);

export default router;
