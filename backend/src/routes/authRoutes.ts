import express from "express";
import { registerUser, loginUser, getMe, verifyClinic } from "../controllers/authController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.patch("/verify-clinic/:userId", protect, adminOnly, verifyClinic);

export default router;
