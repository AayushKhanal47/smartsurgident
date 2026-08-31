import mongoose, { Schema, Document, Types } from "mongoose";

export interface IResource extends Document {
  title: string;
  slug: string;
  summary?: string;
  fileUrl: string;
  coverImage?: string;
  category?: string;
  linkedProducts: Types.ObjectId[];
  linkedBrands: Types.ObjectId[];
  isPublished: boolean;
  publishedAt?: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String },
    fileUrl: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String },
    linkedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    linkedBrands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", summary: "text" });

export default mongoose.model<IResource>("Resource", resourceSchema);
