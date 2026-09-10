import express from "express";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", protect, adminOnly, getContactMessages);
router.patch("/:id/status", protect, adminOnly, updateContactMessageStatus);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

export default router;
