import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  date: Date;
  location?: string;
  body: string;
  isPublished: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    date: { type: Date, required: true },
    location: { type: String },
    body: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });

export default mongoose.model<IEvent>("Event", eventSchema);
