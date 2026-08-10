import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../api/endpoints";
import type { Product } from "../api/endpoints";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) getProductBySlug(slug).then(setProduct).catch(() => setProduct(null));
  }, [slug]);

  if (!product) return <p className="px-10 py-8 text-sm text-slate-400">Loading...</p>;

  return (
    <div className="px-6 md:px-10 py-8 grid md:grid-cols-2 gap-10">
      <div className="bg-brand-tint rounded-2xl h-72 flex items-center justify-center">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded-2xl" />
        ) : (
          <span className="text-6xl">🦷</span>
        )}
      </div>

      <div>
        <p className="text-xs text-slate-400">{product.brand?.name}</p>
        <h1 className="text-2xl font-semibold text-brand-navy mt-1 mb-3">{product.name}</h1>
        <p className="text-xl font-semibold text-brand-blue mb-4">
          Rs {product.price.toLocaleString()}
          <span className="text-sm text-slate-400 font-normal ml-2">
            (Rs {product.clinicPrice.toLocaleString()} for verified clinics)
          </span>
        </p>
        <p className="text-sm text-slate-600 mb-6">{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="bg-brand-blue text-white px-6 py-3 rounded-full font-medium disabled:opacity-40"
        >
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>

        {/* E-library spec sheet */}
        {Object.keys(product.specs || {}).length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6">
            <p className="font-medium text-brand-navy mb-3 text-sm">Specifications</p>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-slate-400">{key}</dt>
                  <dd className="text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
