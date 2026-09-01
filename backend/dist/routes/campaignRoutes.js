"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", campaignController_1.getCampaigns);
router.get("/admin/all", auth_1.protect, auth_1.adminOnly, campaignController_1.getAllCampaignsAdmin);
router.get("/:slug", campaignController_1.getCampaignBySlug);
router.post("/", auth_1.protect, auth_1.adminOnly, campaignController_1.createCampaign);
router.put("/:id", auth_1.protect, auth_1.adminOnly, campaignController_1.updateCampaign);
router.delete("/:id", auth_1.protect, auth_1.adminOnly, campaignController_1.deleteCampaign);
exports.default = router;
