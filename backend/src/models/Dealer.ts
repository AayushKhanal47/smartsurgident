import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDealer extends Document {
  name: string;
  city: Types.ObjectId;
  province?: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  email: string;
  password: string;
  isActive: boolean;

  // Profile fields for the public Dealer Network directory/profile page
  slug: string;
  logo?: string;
  profilePhoto?: string;
  storePhotos: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  description?: string;
  yearsInOperation?: number;
  services: string[];
  brandsCarried: Types.ObjectId[]; // ref Brand
}

const dealerSchema = new Schema<IDealer>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true, unique: true },
    province: { type: String },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    website: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },

    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    profilePhoto: { type: String },
    storePhotos: { type: [String], default: [] },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    openingHours: { type: String },
    description: { type: String },
    yearsInOperation: { type: Number },
    services: { type: [String], default: [] },
    brandsCarried: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true }
);

// One dealer per city keeps routing unambiguous.
// If two dealers ever need to share a city, drop the `unique` on `city`
// and add logic in the routing service to pick between them.

export default mongoose.model<IDealer>("Dealer", dealerSchema);
