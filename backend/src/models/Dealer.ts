import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDealer extends Document {
  name: string;
  city: Types.ObjectId;
  phone: string;
  email: string;
  password: string;
  isActive: boolean;
}

const dealerSchema = new Schema<IDealer>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// One dealer per city keeps routing unambiguous.
// If two dealers ever need to share a city, drop the `unique` on `city`
// and add logic in the routing service to pick between them.

export default mongoose.model<IDealer>("Dealer", dealerSchema);
