import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getProductBySlug } from "../api/endpoints";
import type { Product } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [active, setActive] = useState(0);
  const { addToCart } = useCart();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (slug) getProductBySlug(slug).then(setProduct).catch(() => setProduct(null));
    setActive(0);
  }, [slug]);

  usePageMeta(
    product ? product.name : "",
    product ? product.description?.slice(0, 160) || `${product.name} from ${product.brand?.name ?? "Smart Surgident"}, distributed across Nepal.` : undefined
  );

  if (!product) {
    return <p className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 text-sm text-brand-muted">Loading…</p>;
  }

  const images = product.images ?? [];
  const current = images[Math.min(active, Math.max(0, images.length - 1))];
  const specs = Object.entries(product.specs ?? {});

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10 md:py-16">
      <nav className="text-xs text-brand-muted mb-6">
        <Link to="/products" className="hover:text-brand-primary">Products</Link>
        <span className="mx-1.5">/</span>
        <span className="text-brand-slate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-sunk">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.img
                  key={current}
                  src={current}
                  alt={product.name}
                  initial={reduceMotion ? undefined : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-display text-brand-muted">
                  {product.brand?.name ?? "Smart Surgident"}
                </div>
              )}
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === active}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === active ? "border-brand-primary" : "border-transparent hover:border-brand-border"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand?.name && (
            <Link to={`/brands/${product.brand.slug}`} className="text-xs font-semibold uppercase tracking-[0.09em] text-brand-muted hover:text-brand-primary">
              {product.brand.name}
            </Link>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mt-2">{product.name}</h1>

          <p className="mt-4 text-xl font-semibold text-brand-navy">
            {product.price > 0 ? `Rs ${product.price.toLocaleString()}` : "Request a quote"}
            {product.clinicPrice > 0 && product.clinicPrice !== product.price && (
              <span className="block text-sm font-normal text-brand-muted mt-0.5">
                Rs {product.clinicPrice.toLocaleString()} for verified clinics
              </span>
            )}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-brand-slate">{product.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => addToCart(product)} disabled={product.stock === 0}>
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </Button>
            <Link
              to="/support/quote"
              className="inline-flex items-center justify-center rounded-full px-6 min-h-11 text-sm font-medium border border-brand-border text-brand-navy hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              Request a quote
            </Link>
          </div>

          {specs.length > 0 && (
            <div className="mt-9 border-t border-brand-border pt-6">
              <p className="font-display font-semibold text-brand-navy text-sm mb-3">Specifications</p>
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                {specs.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-brand-border/60 pb-2">
                    <dt className="text-brand-muted">{key}</dt>
                    <dd className="text-brand-navy text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
