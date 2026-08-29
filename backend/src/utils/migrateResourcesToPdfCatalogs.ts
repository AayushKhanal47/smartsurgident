import mongoose from "mongoose";
import dotenv from "dotenv";
import Resource from "../models/Resource";

dotenv.config();

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Migrating resources to PDF-only catalogs...");

  const unsetResult = await Resource.collection.updateMany(
    {},
    { $unset: { type: "", body: "", videoUrl: "" } }
  );
  console.log(`Removed legacy fields from ${unsetResult.modifiedCount} resource documents`);

  const publishedAtResult = await Resource.collection.updateMany(
    { isPublished: true, publishedAt: { $exists: false } },
    { $set: { publishedAt: new Date() } }
  );
  console.log(`Backfilled publishedAt on ${publishedAtResult.modifiedCount} resource documents`);

  console.log("Done. Disconnecting.");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
