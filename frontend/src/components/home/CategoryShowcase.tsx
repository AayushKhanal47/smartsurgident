import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { getCategories } from "../../api/endpoints";
import type { Category } from "../../api/endpoints";
import { exploreLinks } from "../../data/homepage";

interface Tile {
  key: string;
  name: string;
  hint?: string;
  to: string;
  image?: string;
}

// EXPLORE THE RANGE — a premium 3-tile product showcase. Real Category
// records (with an uploaded image) win when they exist; otherwise the
// curated exploreLinks (with their own photography) render identically,
// so the section is never a plain text/link list.
export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  if (categories === null) return null;

  const tiles: Tile[] =
    categories.length > 0
      ? categories.map((cat) => ({
          key: cat._id,
          name: cat.name,
          to: `/categories/${cat.slug}`,
          image: cat.image,
        }))
      : exploreLinks.map((link) => ({
          key: link.label,
          name: link.label,
          hint: link.hint,
          to: link.to,
          image: link.image,
        }));

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

        <div className="mt-14 grid md:grid-cols-3 gap-6 md:gap-7">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.key}
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: Math.min(i, 5) * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={tile.to}
                className="group relative flex flex-col justify-end aspect-[3/4] rounded-[28px] overflow-hidden bg-brand-sunk ring-1 ring-black/[0.04] shadow-[0_1px_3px_rgba(31,44,65,0.08)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(31,44,65,0.16)]"
              >
                {tile.image && (
                  <img
                    src={tile.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent" />
                <div className="relative p-6 md:p-7">
                  <span className="font-display text-xl md:text-[22px] font-semibold text-white leading-snug">
                    {tile.name}
                  </span>
                  {tile.hint && (
                    <p className="mt-1.5 text-[13px] text-white/70 leading-relaxed">{tile.hint}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white transition-transform duration-300 group-hover:translate-x-1">
                    Explore
                    <HiArrowRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
