// Cloudinary URL-rewrite, same technique as pdfThumbnail.ts/brandLogo.ts —
// requests a sized, auto-format/auto-quality version instead of the full
// original upload. A 300px product card was previously served the exact
// same file (often 300KB+) as the 900px detail hero and the 80px gallery
// thumbnails (perf audit, P0). Purely a URL param: the original stays
// untouched in Cloudinary, nothing is re-uploaded.
export function getResizedImageUrl(url: string | undefined, width: number): string | undefined {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/c_fill,w_${width},q_auto,f_auto/`);
}
