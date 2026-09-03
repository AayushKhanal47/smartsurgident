import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  verifyClinic,
  getAdmins,
  createAdmin,
  resetAdminPassword,
  deleteAdmin,
  changeMyPassword,
} from "../controllers/authController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.patch("/verify-clinic/:userId", protect, adminOnly, verifyClinic);

router.patch("/me/password", protect, changeMyPassword);
router.get("/admins", protect, adminOnly, getAdmins);
router.post("/admins", protect, adminOnly, createAdmin);
router.patch("/admins/:id/password", protect, adminOnly, resetAdminPassword);
router.delete("/admins/:id", protect, adminOnly, deleteAdmin);

export default router;
