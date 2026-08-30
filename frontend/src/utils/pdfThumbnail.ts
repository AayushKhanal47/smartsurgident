// Cloudinary can render any page of an uploaded PDF as an image on the fly —
// this builds that URL from the PDF's own URL, so no separate banner upload
// is needed. Requesting page 1 as a JPG works for any Cloudinary PDF URL
// that includes "/upload/" in its path.
export function getPdfThumbnail(fileUrl?: string): string | null {
  if (!fileUrl || !fileUrl.includes("/upload/")) return null;
  return fileUrl.replace("/upload/", "/upload/pg_1,f_jpg,w_400,c_fill/");
}
