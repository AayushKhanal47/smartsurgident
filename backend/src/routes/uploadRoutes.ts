import express from "express";
import { uploadImage } from "../controllers/uploadController";
import { upload } from "../middleware/upload";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

export default router;
