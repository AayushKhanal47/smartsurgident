import mongoose, { Schema, Document } from "mongoose";

// Singleton — one document only (fixed key "singleton"). Holds contact
// details shown on the Contact page and site footer, editable from
// Admin → Settings instead of being hardcoded in the frontend.
export interface ISiteSettings extends Document {
  key: string;
  address: string;
  phone: string;
  email: string;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, default: "singleton", unique: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);
