import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/Order";
import Product from "../models/Product";
import Dealer from "../models/Dealer";

// Generates a readable order number like SS-20260803-0F3A
const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `SS-${date}-${random}`;
};

// POST /api/orders
// This is where the "order from KTM goes to KTM dealer" requirement lives.
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    cityId,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    items, // [{ productId, quantity }]
    isClinicOrder,
  } = req.body;

  if (!cityId || !items?.length) {
    res.status(400);
    throw new Error("City and at least one item are required");
  }

  // 1. Resolve the dealer for this city — this is the routing step
  const dealer = await Dealer.findOne({ city: cityId, isActive: true });
  if (!dealer) {
    res.status(400);
    throw new Error("No active dealer found for the selected city");
  }

  // 2. Validate products, snapshot price/name, and reserve stock atomically
  //    (findOneAndUpdate with a stock condition avoids overselling under
  //    concurrent orders, since Mongo won't decrement below zero here)
  const orderItems = [];
  let totalAmount = 0;

  for (const { productId, quantity } of items) {
    const priceField = isClinicOrder ? "clinicPrice" : "price";

    const product = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: quantity }, isActive: true },
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      res.status(400);
      throw new Error(`Product ${productId} is unavailable or out of stock`);
    }

    const price = isClinicOrder ? product.clinicPrice : product.price;
    orderItems.push({
      product: product._id,
      name: product.name,
      quantity,
      price,
    });
    totalAmount += price * quantity;
  }

  // 3. Create the order, pre-assigned to the resolved dealer
  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    city: cityId,
    assignedDealer: dealer._id,
    items: orderItems,
    totalAmount,
    isClinicOrder: !!isClinicOrder,
  });

  // 4. Notify the dealer.
  //    Swap this for a real push/SMS/email service later (e.g. Twilio, FCM,
  //    or a WebSocket event if the dealer dashboard is open live).
  console.log(`[notify] New order ${order.orderNumber} routed to dealer ${dealer.name}`);

  res.status(201).json(order);
});

// GET /api/orders/dealer  (dealer's own orders — requires dealerOnly middleware)
export const getDealerOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ assignedDealer: req.dealer._id })
    .sort({ createdAt: -1 })
    .populate("city", "name");
  res.json(orders);
});

// PATCH /api/orders/:id/status  (dealer updates status of their own order)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await Order.findOne({ _id: req.params.id, assignedDealer: req.dealer._id });

  if (!order) {
    res.status(404);
    throw new Error("Order not found for this dealer");
  }

  order.status = status;
  await order.save();
  res.json(order);
});

// GET /api/orders  (admin — all orders across all cities)
export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("city", "name")
    .populate("assignedDealer", "name email");
  res.json(orders);
});
