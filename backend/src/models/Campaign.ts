import mongoose, { Schema, Document, Types } from "mongoose";

export type CampaignPlacement = "homepage" | "category" | "standalone";

export interface ICampaign extends Document {
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  products: Types.ObjectId[];
  placement: CampaignPlacement;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const campaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    bannerImage: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    placement: { type: String, enum: ["homepage", "category", "standalone"], default: "standalone" },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// A campaign only shows if isActive AND (no date range set OR the range covers "now") —
// this is what the frontend/homepage query should filter on.
campaignSchema.index({ isActive: 1, placement: 1 });

export default mongoose.model<ICampaign>("Campaign", campaignSchema);
