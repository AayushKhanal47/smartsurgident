import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus =
  | "placed"
  | "accepted_by_dealer"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string; // snapshot at time of order, in case product changes later
  quantity: number;
  price: number; // price actually charged (price or clinicPrice)
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: Types.ObjectId; // optional: guest checkout allowed
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: Types.ObjectId; // drives routing
  assignedDealer: Types.ObjectId; // resolved from city at order creation
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  isClinicOrder: boolean;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    shippingAddress: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    assignedDealer: { type: Schema.Types.ObjectId, ref: "Dealer", required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["placed", "accepted_by_dealer", "dispatched", "delivered", "cancelled"],
      default: "placed",
    },
    isClinicOrder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.index({ assignedDealer: 1, status: 1 });

export default mongoose.model<IOrder>("Order", orderSchema);
