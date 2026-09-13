import mongoose, { Schema, Document } from "mongoose";

export interface IJobOpening extends Document {
  title: string;
  location?: string;
  employmentType?: string; // e.g. "Full-time", "Part-time", "Contract"
  body: string;
  isActive: boolean;
}

const jobOpeningSchema = new Schema<IJobOpening>(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String },
    employmentType: { type: String },
    body: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJobOpening>("JobOpening", jobOpeningSchema);
