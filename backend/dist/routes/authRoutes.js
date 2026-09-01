"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
router.post("/logout", authController_1.logoutUser);
router.get("/me", auth_1.protect, authController_1.getMe);
router.patch("/verify-clinic/:userId", auth_1.protect, auth_1.adminOnly, authController_1.verifyClinic);
exports.default = router;
