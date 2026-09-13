  import { Request, Response } from "express";
  import asyncHandler from "express-async-handler";
  import path from "path";
  import cloudinary from "../config/cloudinary";

  // file-type is ESM-only; this backend compiles to CommonJS. A plain
  // `await import("file-type")` looks right in source, but tsc's
  // commonjs-module output rewrites it into `require("file-type")` (visible
  // in dist/), which throws ERR_REQUIRE_ESM at runtime for a pure-ESM
  // package — ts-node's dev mode doesn't downlevel this the same way, so
  // that alone would have shipped broken and only failed in production.
  // Building the specifier from a string via `new Function` keeps tsc from
  // touching it, so the real dynamic import() Node needs actually runs.
  // eslint-disable-next-line no-new-func
  const importFileType = new Function("specifier", "return import(specifier)") as (
    specifier: string
  ) => Promise<{ fileTypeFromBuffer: (b: Buffer) => Promise<{ mime: string } | undefined> }>;

  const fileTypeFromBuffer = async (buffer: Buffer): Promise<{ mime: string } | undefined> => {
    const mod = await importFileType("file-type");
    return mod.fileTypeFromBuffer(buffer);
  };

  const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const PDF_MIMES = ["application/pdf"];

  const slugifyFileBase = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "catalog";

  const uploadToCloudinary = async (
    req: Request,
    res: Response,
    fieldName: string,
    options: {
      folder: string;
      resourceType?: "image" | "raw";
      publicId?: string;
      allowedMimes: string[];
    }
  ) => {
    if (!req.file) {
      res.status(400);
      throw new Error(`No file uploaded — send it under the field name '${fieldName}'`);
    }

    // multer's fileFilter only checked the client-declared Content-Type,
    // which an attacker fully controls — this checks the file's actual
    // magic bytes before it ever reaches Cloudinary (security audit
    // finding M-5). Uploads are already admin-only; this closes the gap
    // for a compromised/malicious admin session too.
    const detected = await fileTypeFromBuffer(req.file.buffer);
    if (!detected || !options.allowedMimes.includes(detected.mime)) {
      res.status(400);
      throw new Error("File content doesn't match an allowed type for this upload");
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
    const url = await uploadToCloudinary(req, res, "image", {
      folder: "smart-surgident/images",
      allowedMimes: IMAGE_MIMES,
    });

    res.status(201).json({ url });
  });

  export const uploadPdf = asyncHandler(async (req: Request, res: Response) => {
  const originalName = req.file?.originalname || "catalog.pdf";
  const extension = path.extname(originalName).toLowerCase() || ".pdf";
  const baseName = slugifyFileBase(path.basename(originalName, extension));
  const publicId = `${baseName}-${Date.now()}`;

  const url = await uploadToCloudinary(req, res, "pdf", {
    folder: "smart-surgident/catalog-pdfs",
    resourceType: "image",
    publicId,
    allowedMimes: PDF_MIMES,
  });

  res.status(201).json({ url });
});
