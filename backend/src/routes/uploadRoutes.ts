import express from "express";
import { uploadImage, uploadPdf } from "../controllers/uploadController";
import { imageUpload, pdfUpload } from "../middleware/upload";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, adminOnly, imageUpload.single("image"), uploadImage);
router.post("/image", protect, adminOnly, imageUpload.single("image"), uploadImage);
router.post("/pdf", protect, adminOnly, pdfUpload.single("pdf"), uploadPdf);

export default router;
