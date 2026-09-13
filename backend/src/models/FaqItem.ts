import mongoose, { Schema, Document } from "mongoose";

export interface IFaqItem extends Document {
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

const faqItemSchema = new Schema<IFaqItem>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

faqItemSchema.index({ order: 1 });

export default mongoose.model<IFaqItem>("FaqItem", faqItemSchema);
