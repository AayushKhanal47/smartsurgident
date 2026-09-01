"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quoteController_1 = require("../controllers/quoteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", quoteController_1.createQuoteRequest);
router.get("/", auth_1.protect, auth_1.adminOnly, quoteController_1.getQuoteRequests);
router.patch("/:id/status", auth_1.protect, auth_1.adminOnly, quoteController_1.updateQuoteStatus);
exports.default = router;
