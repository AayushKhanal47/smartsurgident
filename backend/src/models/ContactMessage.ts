import mongoose, { Schema, Document } from "mongoose";

export type ContactMessageStatus = "new" | "read";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);
