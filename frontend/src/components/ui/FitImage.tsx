import { useState, type ImgHTMLAttributes } from "react";

// Dealers/brands upload all kinds of images into the same "photo" slot —
// wide storefront photos that should fill the frame (object-cover) as well
// as logos that get cropped unrecognizably if forced to (object-contain is
// correct there instead). A fixed "is this image tall" check isn't enough:
// a landscape logo can still get most of its height sliced off by
// object-cover when the box it's placed in is even wider (e.g. a 1536x1024
// logo inside a 3:1 card thumbnail). So compare the image's own aspect
// ratio against the box it actually renders into (clientWidth/Height, since
// the image fills its container via w-full h-full) and fall back to contain
// whenever cover would crop away more than ~35% of either dimension.
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
        const { naturalWidth: nw, naturalHeight: nh, clientWidth: cw, clientHeight: ch } = img;
        if (!nw || !nh || !cw || !ch) return;
        const imageRatio = nw / nh;
        const boxRatio = cw / ch;
        const visibleFraction = Math.min(imageRatio / boxRatio, boxRatio / imageRatio);
        if (visibleFraction < 0.65) setFit("contain");
      }}
    />
  );
}
