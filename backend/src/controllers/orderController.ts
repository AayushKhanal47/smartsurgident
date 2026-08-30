import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order, { IOrder } from "../models/Order";
import Product from "../models/Product";
import Dealer from "../models/Dealer";
import { sendEmail } from "../utils/email";
import mongoose from "mongoose";

const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `SS-${date}-${random}`;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!
  );

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    cityId,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    items,
  } = req.body;

  if (!cityId || !Array.isArray(items) || !items.length) {
    res.status(400);
    throw new Error("City and at least one item are required");
  }

  if (
    !items.every(
      (item) =>
        typeof item?.productId === "string" &&
        mongoose.isValidObjectId(item.productId) &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0
    )
  ) {
    res.status(400);
    throw new Error("Each order item must have a valid product and a positive whole-number quantity");
  }

  const dealer = await Dealer.findOne({ city: cityId, isActive: true });
  if (!dealer) {
    res.status(400);
    throw new Error("No active dealer found for the selected city");
  }

  const isClinicOrder = req.user?.role === "clinic" && req.user.isVerifiedClinic === true;
  const session = await mongoose.startSession();
  let orderItems: { product: mongoose.Types.ObjectId; name: string; quantity: number; price: number }[] = [];
  let totalAmount = 0;
  let order: IOrder | undefined;

  try {
    order = await session.withTransaction(async () => {
      orderItems = [];
      totalAmount = 0;

      for (const { productId, quantity } of items) {
        const product = await Product.findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity }, isActive: true },
          { $inc: { stock: -quantity } },
          { new: true, session }
        );

        if (!product) throw new Error(`Product ${productId} is unavailable or out of stock`);

        const price = isClinicOrder ? product.clinicPrice : product.price;
        orderItems.push({ product: product._id, name: product.name, quantity, price });
        totalAmount += price * quantity;
      }

      const [createdOrder] = await Order.create(
        [{
          orderNumber: generateOrderNumber(), customerName, customerPhone, customerEmail,
          shippingAddress, city: cityId, assignedDealer: dealer._id, items: orderItems,
          totalAmount, isClinicOrder, ...(req.user ? { user: req.user._id } : {}),
        }],
        { session }
      );
      return createdOrder;
    });
  } finally {
    await session.endSession();
  }

  if (!order) {
    throw new Error("Order could not be created");
  }

  const itemsList = orderItems
    .map((i) => `<li>${escapeHtml(i.name)} × ${i.quantity} — Rs ${i.price * i.quantity}</li>`)
    .join("");

  await sendEmail({
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

export const getDealerOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ assignedDealer: req.dealer._id })
    .sort({ createdAt: -1 })
    .populate("city", "name");
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const allowedStatuses = ["placed", "accepted_by_dealer", "dispatched", "delivered", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const session = await mongoose.startSession();
  let order: IOrder | undefined;
  try {
    order = await session.withTransaction(async () => {
      const foundOrder = await Order.findOne({ _id: req.params.id, assignedDealer: req.dealer._id }).session(session);
      if (!foundOrder) throw new Error("Order not found for this dealer");

      // Return inventory exactly once if an order is cancelled.
      if (status === "cancelled" && foundOrder.status !== "cancelled") {
        await Product.bulkWrite(
          foundOrder.items.map((item) => ({
            updateOne: { filter: { _id: item.product }, update: { $inc: { stock: item.quantity } } },
          })),
          { session }
        );
      }

      foundOrder.status = status;
      await foundOrder.save({ session });
      return foundOrder;
    });
  } finally {
    await session.endSession();
  }

  if (!order) {
    res.status(404);
    throw new Error("Order not found for this dealer");
  }
  res.json(order);
});

export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("city", "name")
    .populate("assignedDealer", "name email");
  res.json(orders);
});
