import mongoose, { Schema, Document } from "mongoose";

export type QuoteStatus = "new" | "in_progress" | "quoted" | "closed";

export interface IQuoteRequest extends Document {
  organizationName: string;
  contactName: string;
  phone: string;
  email?: string;
  items: string; // freeform for now — "10x extraction forceps, 5x curing lights"
  message?: string;
  status: QuoteStatus;
}

const quoteRequestSchema = new Schema<IQuoteRequest>(
  {
    organizationName: { type: String, required: true },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    items: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ["new", "in_progress", "quoted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model<IQuoteRequest>("QuoteRequest", quoteRequestSchema);
