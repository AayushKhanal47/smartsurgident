// Run with: npx ts-node src/utils/seed.ts
// Populates the 5 cities, a couple of brands, and one sample product so the
// frontend has something to display immediately. Dealers must be created
// separately via the admin API since each needs its own login password.

import mongoose from "mongoose";
import dotenv from "dotenv";
import City from "../models/City";
import Brand from "../models/Brand";
import Product from "../models/Product";

dotenv.config();

const CITIES = ["Kathmandu", "Chitwan", "Pokhara", "Butwal", "Biratnagar"];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected. Seeding...");

  const cityDocs = await Promise.all(
    CITIES.map((name) =>
      City.findOneAndUpdate(
        { slug: name.toLowerCase() },
        { name, slug: name.toLowerCase() },
        { upsert: true, new: true }
      )
    )
  );
  console.log(`Seeded ${cityDocs.length} cities`);

  const dentsply = await Brand.findOneAndUpdate(
    { slug: "dentsply" },
    { name: "Dentsply", slug: "dentsply" },
    { upsert: true, new: true }
  );

  await Product.findOneAndUpdate(
    { sku: "SS-0001" },
    {
      name: "Extraction Forceps Set",
      slug: "extraction-forceps-set",
      brand: dentsply._id,
      category: "Hand instruments",
      description: "Stainless steel extraction forceps set for general dental procedures.",
      specs: { Material: "Stainless steel", "Set size": "6 pieces", Origin: "India" },
      images: [],
      price: 4500,
      clinicPrice: 3900,
      stock: 25,
      sku: "SS-0001",
    },
    { upsert: true, new: true }
  );
  console.log("Seeded sample brand + product");

  console.log("Done. Disconnecting.");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
