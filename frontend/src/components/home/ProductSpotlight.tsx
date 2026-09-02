import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { getProductBySlug } from "../../api/endpoints";
import type { Product } from "../../api/endpoints";
import { spotlight } from "../../data/homepage";
import { ButtonLink } from "../ui/Button";

// PRODUCT SPOTLIGHT — one real product shown large with a thumbnail strip of
// every image on the record. Renders nothing until `spotlight.productSlug`
// points at a product that has at least one image.
export default function ProductSpotlight() {
  const [product, setProduct] = useState<Product | null>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!spotlight.productSlug) return;
    getProductBySlug(spotlight.productSlug).then(setProduct).catch(() => setProduct(null));
  }, []);

  const images = product?.images ?? [];
  if (!product || images.length === 0) return null;

  const activeImage = images[Math.min(active, images.length - 1)];
  const specs = Object.entries(product.specs ?? {}).slice(0, 4);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-sunk shadow-[0_30px_80px_-32px_rgba(31,44,65,0.3)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                initial={reduceMotion ? undefined : { opacity: 0 }}
                animate={reduceMotion ? undefined : { opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === active}
                  className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === active ? "border-brand-primary" : "border-transparent hover:border-brand-border"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">{spotlight.eyebrow}</span>
          {product.brand?.name && (
            <p className="mt-3 text-xs uppercase tracking-[0.1em] text-brand-muted">{product.brand.name}</p>
          )}
          <h2 className="display-2 mt-1 text-brand-navy">{product.name}</h2>
          <p className="mt-5 text-[15px] md:text-base leading-relaxed text-brand-slate max-w-md">
            {product.description || spotlight.fallbackHeadline}
          </p>

          {specs.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
              {specs.map(([k, v]) => (
                <div key={k} className="border-t border-brand-border pt-2">
                  <dt className="text-xs uppercase tracking-[0.06em] text-brand-muted">{k}</dt>
                  <dd className="text-sm text-brand-navy mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <ButtonLink to={`/products/${product.slug}`}>View product</ButtonLink>
            {product.price > 0 && (
              <span className="text-sm font-semibold text-brand-navy">
                Rs {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
