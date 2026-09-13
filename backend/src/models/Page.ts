import mongoose, { Schema, Document } from "mongoose";

// Generic single-page content — About/Facilities/Warranty share this shape
// (title + a body of paragraphs) instead of needing one model each. `slug`
// is a fixed, known key (e.g. "about", "facilities", "warranty"), not a
// user-chosen one — there's no create/delete, only get-or-default + upsert.
export interface IPage extends Document {
  slug: string;
  title: string;
  body: string;
}

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IPage>("Page", pageSchema);
