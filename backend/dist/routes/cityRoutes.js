"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cityController_1 = require("../controllers/cityController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", cityController_1.getCities);
router.post("/", auth_1.protect, auth_1.adminOnly, cityController_1.createCity);
exports.default = router;
