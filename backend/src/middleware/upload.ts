import multer from "multer";

// Files are held in memory only long enough to stream to Cloudinary —
// nothing is written to disk on the server.
const storage = multer.memoryStorage();

const createFileFilter =
  (allowed: string[], message: string) =>
  (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(message));
    }
  };

export const imageUpload = multer({
  storage,
  fileFilter: createFileFilter(
    ["image/jpeg", "image/png", "image/webp", "image/gif"],
    "Only JPEG, PNG, WEBP, or GIF images are allowed"
  ),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

export const pdfUpload = multer({
  storage,
  fileFilter: createFileFilter(["application/pdf"], "Only PDF files are allowed"),
  // 200MB app-level cap. Cloudinary's own account plan may still reject
  // large files below this regardless (free/basic tiers commonly cap raw
  // uploads well under this) — if big catalogues still fail to upload,
  // check the Cloudinary plan's file-size limit.
  limits: { fileSize: 200 * 1024 * 1024 },
});
