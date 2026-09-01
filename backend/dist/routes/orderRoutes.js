"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public — anyone (guest or logged in) can place an order
router.post("/", auth_1.optionalProtect, orderController_1.createOrder);
// Dealer's own routed orders
router.get("/dealer", auth_1.protect, auth_1.dealerOnly, orderController_1.getDealerOrders);
router.patch("/:id/status", auth_1.protect, auth_1.dealerOnly, orderController_1.updateOrderStatus);
// Admin — see everything across all cities
router.get("/", auth_1.protect, auth_1.adminOnly, orderController_1.getAllOrders);
exports.default = router;
