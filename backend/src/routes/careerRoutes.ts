import express from "express";
import {
  getJobOpenings,
  getAllJobOpeningsAdmin,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
} from "../controllers/careerController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getJobOpenings);
router.get("/admin/all", protect, adminOnly, getAllJobOpeningsAdmin);
router.post("/", protect, adminOnly, createJobOpening);
router.put("/:id", protect, adminOnly, updateJobOpening);
router.delete("/:id", protect, adminOnly, deleteJobOpening);

export default router;
