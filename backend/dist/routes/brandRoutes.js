"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brandController_1 = require("../controllers/brandController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", brandController_1.getBrands);
router.post("/", auth_1.protect, auth_1.adminOnly, brandController_1.createBrand);
router.put("/:id", auth_1.protect, auth_1.adminOnly, brandController_1.updateBrand);
router.delete("/:id", auth_1.protect, auth_1.adminOnly, brandController_1.deleteBrand);
exports.default = router;
