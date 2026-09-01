"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dealerController_1 = require("../controllers/dealerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/public", dealerController_1.getPublicDealers);
router.get("/public/:slug", dealerController_1.getPublicDealerBySlug);
router.post("/login", dealerController_1.loginDealer);
router.post("/logout", dealerController_1.logoutDealer);
router.post("/", auth_1.protect, auth_1.adminOnly, dealerController_1.createDealer);
router.get("/", auth_1.protect, auth_1.adminOnly, dealerController_1.getDealers);
router.put("/:id", auth_1.protect, auth_1.adminOnly, dealerController_1.updateDealer);
router.delete("/:id", auth_1.protect, auth_1.adminOnly, dealerController_1.deleteDealer);
exports.default = router;
