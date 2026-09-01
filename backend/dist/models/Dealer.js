"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const dealerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    city: { type: mongoose_1.Schema.Types.ObjectId, ref: "City", required: true, unique: true },
    province: { type: String },
    phone: { type: String, required: true },
    whatsapp: { type: String },
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
    brandsCarried: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Brand" }],
}, { timestamps: true });
// One dealer per city keeps routing unambiguous.
// If two dealers ever need to share a city, drop the `unique` on `city`
// and add logic in the routing service to pick between them.
exports.default = mongoose_1.default.model("Dealer", dealerSchema);
