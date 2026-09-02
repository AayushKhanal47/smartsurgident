import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { getCategories } from "../../api/endpoints";
import type { Category } from "../../api/endpoints";
import { exploreLinks } from "../../data/homepage";

// EXPLORE THE RANGE. Large image tiles when Category records exist; an
// editorial link list otherwise. Never a small-card grid.
export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  if (categories === null) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="eyebrow">Explore the range</span>
          <h2 className="display-2 mt-3 text-brand-navy">
            A full range for the modern practice
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-relaxed text-brand-slate">
            From treatment units to everyday consumables — sourced from established
            manufacturers and supported across Nepal.
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="mt-12 border-t border-brand-border">
            {exploreLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  to={link.to}
                  className="group flex items-baseline justify-between gap-5 border-b border-brand-border py-7 md:py-9"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-brand-navy group-hover:text-brand-primary transition-colors">
                      {link.label}
                    </p>
                    <p className="mt-1 text-sm text-brand-muted">{link.hint}</p>
                  </div>
                  <HiArrowRight
                    className="text-brand-primary text-xl shrink-0 translate-y-1 transition-transform duration-300 group-hover:translate-x-1.5"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.06 }}
              >
                <Link
                  to={`/categories/${cat.slug}`}
                  className="group relative flex flex-col justify-end aspect-[4/5] rounded-2xl overflow-hidden bg-brand-sunk"
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/10 to-transparent" />
                  <div className="relative p-5 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-white">{cat.name}</span>
                    <HiArrowRight className="text-white text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
