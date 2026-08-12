import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  console.log("=== UPLOAD DEBUG ===");
  console.log("User:", req.user?._id, req.user?.email, req.user?.role);
  console.log("File:", req.file?.originalname, req.file?.mimetype, req.file?.size);

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded — send it under the field name 'image'");
  }

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "smart-surgident" },
      (error, uploadResult) => {
        if (error) {
          console.error("=== CLOUDINARY UPLOAD ERROR ===");
          console.error(error);
          return reject(error);
        }

        if (!uploadResult) {
          return reject(new Error("Cloudinary returned no upload result"));
        }

        console.log("=== CLOUDINARY UPLOAD SUCCESS ===");
        console.log(uploadResult.secure_url);

        resolve(uploadResult);
      }
    );

    stream.end(req.file!.buffer);
  });

  res.status(201).json({ url: result.secure_url });
});
