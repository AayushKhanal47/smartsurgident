import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import type { Product } from "../api/endpoints";

// Premium, minimal product card. The product image is the focus; one badge
// max, no icon clutter, price or "Request a quote".
export default function ProductCard({ product }: { product: Product }) {
  const badge = product.isBestSeller
    ? "Best seller"
    : product.isNewArrival
    ? "New"
    : product.isFeatured
    ? "Featured"
    : null;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary rounded-2xl"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-sunk">
        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-white/95 text-brand-navy text-[11px] font-semibold uppercase tracking-[0.06em] px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="font-display text-base font-semibold text-brand-muted">
              {product.brand?.name ?? "Smart Surgident"}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {product.brand?.name && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-brand-muted">
              {product.brand.name}
            </p>
          )}
          <p className="mt-1 font-display text-lg font-semibold text-brand-navy leading-snug">
            {product.name}
          </p>
          <p className="mt-1.5 text-sm text-brand-slate">
            {product.price > 0 ? `Rs ${product.price.toLocaleString()}` : "Request a quote"}
          </p>
        </div>
        <HiArrowRight
          className="text-brand-primary text-lg shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
