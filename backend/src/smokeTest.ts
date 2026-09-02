// Temporary smoke-test entry point — verifies the app boots and every route
// mounts without a real MongoDB connection. Deleted after verification.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import brandRoutes from "./routes/brandRoutes";
import cityRoutes from "./routes/cityRoutes";
import dealerRoutes from "./routes/dealerRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import homepageSectionRoutes from "./routes/homepageSectionRoutes";
import quoteRoutes from "./routes/quoteRoutes";

process.env.JWT_SECRET = process.env.JWT_SECRET || "smoke-test-secret";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/homepage-sections", homepageSectionRoutes);
app.use("/api/quotes", quoteRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(Number(process.env.PORT) || 5002, () => console.log("SMOKE_TEST_SERVER_UP"));
