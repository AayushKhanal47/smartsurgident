import express from "express";
import rateLimit from "express-rate-limit";
import {
  createOrder,
  getDealerOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController";
import { protect, optionalProtect, adminOnly, dealerOnly } from "../middleware/auth";

const router = express.Router();

// Checkout is public/unauthenticated and both decrements real stock and
// emails a real dealer per call — needs a tighter, dedicated limit than the
// generic API-wide one (security audit finding H-1). Scoped to just this
// route so it never throttles legitimate admin/dealer order management.
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many orders from this address, please try again later." },
});

// Public — anyone (guest or logged in) can place an order
router.post("/", createOrderLimiter, optionalProtect, createOrder);

// Dealer's own routed orders
router.get("/dealer", protect, dealerOnly, getDealerOrders);
router.patch("/:id/status", protect, dealerOnly, updateOrderStatus);

// Admin — see everything across all cities
router.get("/", protect, adminOnly, getAllOrders);

export default router;
