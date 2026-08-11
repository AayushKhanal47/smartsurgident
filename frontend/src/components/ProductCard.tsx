import { Link } from "react-router-dom";
import type { Product } from "../api/endpoints";

export default function ProductCard({ product }: { product: Product }) {
  const badge = product.isBestSeller
    ? "Best seller"
    : product.isNewArrival
    ? "New"
    : product.isFeatured
    ? "Featured"
    : product.badges?.[0];

  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-2xl overflow-hidden block hover:shadow-md transition-shadow relative"
    >
      {badge && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-brand-navy text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
      <div className="h-28 bg-brand-tint flex items-center justify-center">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-brand-light text-3xl">🦷</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-400">{product.brand?.name}</p>
        <p className="text-sm font-medium text-brand-navy mt-1 mb-2">{product.name}</p>
        <p className="text-sm font-semibold text-brand-blue">Rs {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
