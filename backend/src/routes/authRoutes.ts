import express from "express";
import { registerUser, loginUser, logoutUser, getMe, verifyClinic } from "../controllers/authController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.patch("/verify-clinic/:userId", protect, adminOnly, verifyClinic);

export default router;
