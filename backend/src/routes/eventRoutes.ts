import express from "express";
import {
  getEvents,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getEvents);
router.get("/admin/all", protect, adminOnly, getAllEventsAdmin);
router.post("/", protect, adminOnly, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
