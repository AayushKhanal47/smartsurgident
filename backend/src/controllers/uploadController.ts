import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary";

// POST /api/upload  (admin only, multipart/form-data with field name "image")
// Returns { url } — the resulting Cloudinary URL to store on a Product,
// Brand, or Dealer document.
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded — send it under the field name 'image'");
  }

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "smart-surgident" },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error);
        resolve(uploadResult);
      }
    );
    stream.end(req.file!.buffer);
  });

  res.status(201).json({ url: result.secure_url });
});
