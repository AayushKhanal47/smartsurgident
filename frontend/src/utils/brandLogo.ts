// Uploaded brand logo files are frequently centered on a large square canvas
// with a lot of surrounding whitespace, which makes the actual mark look
// tiny once `object-contain` fits that whole canvas into a small UI box.
// Cloudinary's `e_trim` crops the uniform-color border automatically so the
// logo fills its frame — same URL-rewrite approach as pdfThumbnail.ts.
export function getTrimmedLogoUrl(logoUrl?: string): string | undefined {
  if (!logoUrl || !logoUrl.includes("/upload/")) return logoUrl;
  return logoUrl.replace("/upload/", "/upload/e_trim/");
}
