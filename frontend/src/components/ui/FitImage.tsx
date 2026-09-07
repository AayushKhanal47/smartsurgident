import { useState, type ImgHTMLAttributes } from "react";

// Dealers/brands upload all kinds of images into the same "photo" slot —
// wide storefront photos that should fill the frame (object-cover) as well
// as tall logos that get cropped unrecognizably if forced to (object-contain
// is correct there instead). Decide per-image from its own measured aspect
// ratio on load rather than hardcoding one behavior for every upload.
export default function FitImage({
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [fit, setFit] = useState<"cover" | "contain">("cover");

  return (
    <img
      {...props}
      className={`${className} ${fit === "cover" ? "object-cover" : "object-contain"}`}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalHeight > img.naturalWidth * 1.15) setFit("contain");
      }}
    />
  );
}
