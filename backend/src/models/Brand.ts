import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  heroImage?: string;
  story?: string;
  foundedInfo?: string; // freeform e.g. "Founded 1899, Germany" — only filled when real
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logoUrl: { type: String },
    description: { type: String },
    heroImage: { type: String },
    story: { type: String },
    foundedInfo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBrand>("Brand", brandSchema);
