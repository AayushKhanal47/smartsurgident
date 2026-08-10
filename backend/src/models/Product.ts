import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: Types.ObjectId;
  category: string;
  description: string;
  // Freeform spec sheet for the e-library — keys vary per product
  // (e.g. { "Material": "Stainless steel", "Length": "14cm" })
  specs: Record<string, string>;
  images: string[];
  price: number;
  clinicPrice: number; // discounted bulk price for verified clinic accounts
  stock: number;
  sku: string;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    specs: { type: Schema.Types.Mixed, default: {} },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    clinicPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model<IProduct>("Product", productSchema);
