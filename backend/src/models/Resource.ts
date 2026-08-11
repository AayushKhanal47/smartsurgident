import mongoose, { Schema, Document, Types } from "mongoose";

export type ResourceType = "article" | "guide" | "catalog" | "video" | "brochure" | "manual";

export interface IResource extends Document {
  title: string;
  slug: string;
  type: ResourceType;
  summary: string;
  body?: string; // for articles/guides — rendered content
  fileUrl?: string; // for catalogs/brochures/manuals — a downloadable file
  videoUrl?: string; // for videos — external embed link
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
    type: {
      type: String,
      enum: ["article", "guide", "catalog", "video", "brochure", "manual"],
      required: true,
    },
    summary: { type: String, required: true },
    body: { type: String },
    fileUrl: { type: String },
    videoUrl: { type: String },
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
