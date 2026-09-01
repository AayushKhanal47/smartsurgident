"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.updateOrderStatus = exports.getDealerOrders = exports.createOrder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Dealer_1 = __importDefault(require("../models/Dealer"));
const email_1 = require("../utils/email");
const mongoose_1 = __importDefault(require("mongoose"));
const generateOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `SS-${date}-${random}`;
};
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
exports.createOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { cityId, customerName, customerPhone, customerEmail, shippingAddress, items, } = req.body;
    if (!cityId || !Array.isArray(items) || !items.length) {
        res.status(400);
        throw new Error("City and at least one item are required");
    }
    if (!items.every((item) => typeof item?.productId === "string" &&
        mongoose_1.default.isValidObjectId(item.productId) &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0)) {
        res.status(400);
        throw new Error("Each order item must have a valid product and a positive whole-number quantity");
    }
    const dealer = await Dealer_1.default.findOne({ city: cityId, isActive: true });
    if (!dealer) {
        res.status(400);
        throw new Error("No active dealer found for the selected city");
    }
    const isClinicOrder = req.user?.role === "clinic" && req.user.isVerifiedClinic === true;
    const session = await mongoose_1.default.startSession();
    let orderItems = [];
    let totalAmount = 0;
    let order;
    try {
        order = await session.withTransaction(async () => {
            orderItems = [];
            totalAmount = 0;
            for (const { productId, quantity } of items) {
                const product = await Product_1.default.findOneAndUpdate({ _id: productId, stock: { $gte: quantity }, isActive: true }, { $inc: { stock: -quantity } }, { new: true, session });
                if (!product)
                    throw new Error(`Product ${productId} is unavailable or out of stock`);
                const price = isClinicOrder ? product.clinicPrice : product.price;
                orderItems.push({ product: product._id, name: product.name, quantity, price });
                totalAmount += price * quantity;
            }
            const [createdOrder] = await Order_1.default.create([{
                    orderNumber: generateOrderNumber(), customerName, customerPhone, customerEmail,
                    shippingAddress, city: cityId, assignedDealer: dealer._id, items: orderItems,
                    totalAmount, isClinicOrder, ...(req.user ? { user: req.user._id } : {}),
                }], { session });
            return createdOrder;
        });
    }
    finally {
        await session.endSession();
    }
    if (!order) {
        throw new Error("Order could not be created");
    }
    const itemsList = orderItems
        .map((i) => `<li>${escapeHtml(i.name)} × ${i.quantity} — Rs ${i.price * i.quantity}</li>`)
        .join("");
    await (0, email_1.sendEmail)({
        to: dealer.email,
        subject: `New order ${order.orderNumber} routed to you`,
        html: `
      <p>A new order has been routed to <strong>${dealer.name}</strong>.</p>
      <p><strong>Customer:</strong> ${escapeHtml(customerName)} — ${escapeHtml(customerPhone)}</p>
      <p><strong>Delivery address:</strong> ${escapeHtml(shippingAddress)}</p>
      <p><strong>Items:</strong></p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> Rs ${totalAmount}</p>
      <p>Order number: ${order.orderNumber}</p>
    `,
    });
    res.status(201).json(order);
});
exports.getDealerOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const orders = await Order_1.default.find({ assignedDealer: req.dealer._id })
        .sort({ createdAt: -1 })
        .populate("city", "name");
    res.json(orders);
});
exports.updateOrderStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ["placed", "accepted_by_dealer", "dispatched", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error("Invalid order status");
    }
    const session = await mongoose_1.default.startSession();
    let order;
    try {
        order = await session.withTransaction(async () => {
            const foundOrder = await Order_1.default.findOne({ _id: req.params.id, assignedDealer: req.dealer._id }).session(session);
            if (!foundOrder)
                throw new Error("Order not found for this dealer");
            // Return inventory exactly once if an order is cancelled.
            if (status === "cancelled" && foundOrder.status !== "cancelled") {
                await Product_1.default.bulkWrite(foundOrder.items.map((item) => ({
                    updateOne: { filter: { _id: item.product }, update: { $inc: { stock: item.quantity } } },
                })), { session });
            }
            foundOrder.status = status;
            await foundOrder.save({ session });
            return foundOrder;
        });
    }
    finally {
        await session.endSession();
    }
    if (!order) {
        res.status(404);
        throw new Error("Order not found for this dealer");
    }
    res.json(order);
});
exports.getAllOrders = (0, express_async_handler_1.default)(async (_req, res) => {
    const orders = await Order_1.default.find()
        .sort({ createdAt: -1 })
        .populate("city", "name")
        .populate("assignedDealer", "name email");
    res.json(orders);
});
