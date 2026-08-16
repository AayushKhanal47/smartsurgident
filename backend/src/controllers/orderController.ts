import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/Order";
import Product from "../models/Product";
import Dealer from "../models/Dealer";
import { sendEmail } from "../utils/email";

const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `SS-${date}-${random}`;
};

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    cityId,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    items,
    isClinicOrder,
  } = req.body;

  if (!cityId || !items?.length) {
    res.status(400);
    throw new Error("City and at least one item are required");
  }

  const dealer = await Dealer.findOne({ city: cityId, isActive: true });
  if (!dealer) {
    res.status(400);
    throw new Error("No active dealer found for the selected city");
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const { productId, quantity } of items) {
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

  const itemsList = orderItems
    .map((i) => `<li>${i.name} × ${i.quantity} — Rs ${i.price * i.quantity}</li>`)
    .join("");

  await sendEmail({
    to: dealer.email,
    subject: `New order ${order.orderNumber} routed to you`,
    html: `
      <p>A new order has been routed to <strong>${dealer.name}</strong>.</p>
      <p><strong>Customer:</strong> ${customerName} — ${customerPhone}</p>
      <p><strong>Delivery address:</strong> ${shippingAddress}</p>
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
  const order = await Order.findOne({ _id: req.params.id, assignedDealer: req.dealer._id });

  if (!order) {
    res.status(404);
    throw new Error("Order not found for this dealer");
  }

  order.status = status;
  await order.save();
  res.json(order);
});

export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("city", "name")
    .populate("assignedDealer", "name email");
  res.json(orders);
});