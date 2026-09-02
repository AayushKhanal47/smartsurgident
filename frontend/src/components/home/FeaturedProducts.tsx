import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { getProducts } from "../../api/endpoints";
import type { Product } from "../../api/endpoints";
import ProductCard from "../ProductCard";

// FEATURED PRODUCTS. Prefers flagged products, falls back to most recent.
// Larger 2/3-up presentation. Renders nothing when the catalogue is empty.
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getProducts()
      .then((all) => {
        const flagged = all.filter((p) => p.isFeatured || p.isBestSeller || p.isNewArrival);
        setProducts((flagged.length ? flagged : all).slice(0, 6));
      })
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  const cols = products.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div className="max-w-xl">
            <span className="eyebrow">From the catalogue</span>
            <h2 className="display-2 mt-3 text-brand-navy">Featured equipment</h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary"
          >
            View all products
            <HiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className={`grid grid-cols-1 ${cols} gap-6 md:gap-8`}>
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
