import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  slug: string;
}

const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICity>("City", citySchema);
