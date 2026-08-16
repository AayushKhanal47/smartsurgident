import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { getProducts } from "../../api/endpoints";
import type { Product } from "../../api/endpoints";
import ProductCard from "../ProductCard";

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.slice(0, 5)))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-brand-bg py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">
              From The Catalog
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mt-2">
              Best sellers
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-blue hover:text-brand-navy transition-colors flex items-center gap-1"
          >
            View all <HiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
