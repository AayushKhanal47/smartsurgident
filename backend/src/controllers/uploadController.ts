  import { Request, Response } from "express";
  import asyncHandler from "express-async-handler";
  import path from "path";
  import cloudinary from "../config/cloudinary";

  const slugifyFileBase = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "catalog";

  const uploadToCloudinary = async (
    req: Request,
    fieldName: string,
    options: {
      folder: string;
      resourceType?: "image" | "raw";
      publicId?: string;
    }
  ) => {
    console.log("=== UPLOAD DEBUG ===");
    console.log("User:", req.user?._id, req.user?.email, req.user?.role);
    console.log("File:", req.file?.originalname, req.file?.mimetype, req.file?.size);

    if (!req.file) {
      throw new Error(`No file uploaded — send it under the field name '${fieldName}'`);
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          resource_type: options.resourceType || "image",
          ...(options.publicId ? { public_id: options.publicId } : {}),
        },
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

    return result.secure_url;
  };

  export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const url = await uploadToCloudinary(req, "image", {
      folder: "smart-surgident/images",
    });

    res.status(201).json({ url });
  });

  export const uploadPdf = asyncHandler(async (req: Request, res: Response) => {
  const originalName = req.file?.originalname || "catalog.pdf";
  const extension = path.extname(originalName).toLowerCase() || ".pdf";
  const baseName = slugifyFileBase(path.basename(originalName, extension));
  const publicId = `${baseName}-${Date.now()}`;

  const url = await uploadToCloudinary(req, "pdf", {
    folder: "smart-surgident/catalog-pdfs",
    resourceType: "image",
    publicId,
  });

  res.status(201).json({ url });
});
