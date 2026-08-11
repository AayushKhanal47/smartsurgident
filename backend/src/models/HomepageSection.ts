import mongoose, { Schema, Document } from "mongoose";

export type SectionType =
  | "hero"
  | "featured_products"
  | "new_products"
  | "best_sellers"
  | "featured_brands"
  | "campaign_banner"
  | "categories";

export interface IHomepageSection extends Document {
  type: SectionType;
  title?: string;
  subtitle?: string;
  // Freeform per-type config, e.g. { productIds: [...] } or { campaignSlug: "..." } —
  // kept flexible since each section type needs different fields.
  config: Record<string, unknown>;
  order: number;
  isVisible: boolean;
}

const homepageSectionSchema = new Schema<IHomepageSection>(
  {
    type: {
      type: String,
      enum: [
        "hero",
        "featured_products",
        "new_products",
        "best_sellers",
        "featured_brands",
        "campaign_banner",
        "categories",
      ],
      required: true,
    },
    title: { type: String },
    subtitle: { type: String },
    config: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, required: true, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

homepageSectionSchema.index({ order: 1 });

export default mongoose.model<IHomepageSection>("HomepageSection", homepageSectionSchema);
