import mongoose, { Schema, Document } from "mongoose";

export interface INewsPost extends Document {
  title: string;
  slug: string;
  date: Date;
  body: string;
  isPublished: boolean;
}

const newsPostSchema = new Schema<INewsPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    date: { type: Date, required: true, default: Date.now },
    body: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

newsPostSchema.index({ date: -1 });

export default mongoose.model<INewsPost>("NewsPost", newsPostSchema);
