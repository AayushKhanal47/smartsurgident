import mongoose, { Schema, Document } from "mongoose";

// Long-form buying-guide / how-to content — the "content cluster" article
// type from the SEO strategy (e.g. "Endodontic Equipment Guide for Dental
// Clinics in Nepal"), distinct from Resource (PDF catalogues) and NewsPost
// (short announcements). relatedCategorySlug links the article back to a
// real /categories/:slug page for internal linking; optional since not
// every guide maps to exactly one category.
export interface IGuide extends Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  relatedCategorySlug?: string;
  isPublished: boolean;
  publishedAt: Date;
}

const guideSchema = new Schema<IGuide>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    relatedCategorySlug: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

guideSchema.index({ publishedAt: -1 });

export default mongoose.model<IGuide>("Guide", guideSchema);
