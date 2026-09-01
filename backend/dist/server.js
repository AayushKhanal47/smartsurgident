"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const cityRoutes_1 = __importDefault(require("./routes/cityRoutes"));
const dealerRoutes_1 = __importDefault(require("./routes/dealerRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const homepageSectionRoutes_1 = __importDefault(require("./routes/homepageSectionRoutes"));
const quoteRoutes_1 = __importDefault(require("./routes/quoteRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV !== "production")
    app.use((0, morgan_1.default)("dev"));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/brands", brandRoutes_1.default);
app.use("/api/cities", cityRoutes_1.default);
app.use("/api/dealers", dealerRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/campaigns", campaignRoutes_1.default);
app.use("/api/resources", resourceRoutes_1.default);
app.use("/api/homepage-sections", homepageSectionRoutes_1.default);
app.use("/api/quotes", quoteRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
