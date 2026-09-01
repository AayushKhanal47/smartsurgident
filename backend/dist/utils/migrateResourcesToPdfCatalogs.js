"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Resource_1 = __importDefault(require("../models/Resource"));
dotenv_1.default.config();
const run = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }
    await mongoose_1.default.connect(process.env.MONGO_URI);
    console.log("Connected. Migrating resources to PDF-only catalogs...");
    const unsetResult = await Resource_1.default.collection.updateMany({}, { $unset: { type: "", body: "", videoUrl: "" } });
    console.log(`Removed legacy fields from ${unsetResult.modifiedCount} resource documents`);
    const publishedAtResult = await Resource_1.default.collection.updateMany({ isPublished: true, publishedAt: { $exists: false } }, { $set: { publishedAt: new Date() } });
    console.log(`Backfilled publishedAt on ${publishedAtResult.modifiedCount} resource documents`);
    console.log("Done. Disconnecting.");
    await mongoose_1.default.disconnect();
};
run().catch((error) => {
    console.error(error);
    process.exit(1);
});
