import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";

import hongke from "../../assets/brands/brand-hongke.jpg";
import bondentCbct from "../../assets/brands/brand-bondent-cbct.jpg";
import bonsensor from "../../assets/brands/brand-bonsensor.jpg";
import betterway from "../../assets/brands/brand-betterway.jpg";
import aries from "../../assets/brands/brand-aries.jpg";
import youjoy from "../../assets/brands/brand-youjoy.jpg";

const IMPORTS = [
  { brand: "Hongke", name: "HK-510 Dental Chair", image: hongke },
  { brand: "Bondent", name: "3-in-1 Smart CBCT", image: bondentCbct },
  { brand: "Betterway", name: "Endo Motors & Handpieces", image: betterway },
  { brand: "Bondent", name: "BonSensor Digital Sensor", image: bonsensor },
  { brand: "SONZ", name: "Aries Steam Sterilizer", image: aries },
  { brand: "YouJoy", name: "Intraoral Scanner", image: youjoy },
];

// WHAT WE IMPORT — real product photography from the manufacturers Smart
// Surgident distributes. Frontend-only (local assets), same pattern as
// CategoryShowcase's fallback tiles, so it needs no catalogue data to show.
export default function FeaturedImports() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-bg py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="eyebrow">What we import</span>
          <h2 className="display-2 mt-3 text-brand-navy">
            Equipment from trusted global manufacturers
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-relaxed text-brand-slate">
            A sample of the genuine dental and surgical equipment lines we bring
            into Nepal — sourced directly, not through grey-market imports.
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {IMPORTS.map((item, i) => (
            <motion.div
              key={`${item.brand}-${item.name}`}
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.06 }}
            >
              <Link
                to="/products"
                className="group relative flex flex-col justify-end aspect-square rounded-2xl overflow-hidden bg-white ring-1 ring-black/[0.04] shadow-[0_1px_3px_rgba(31,44,65,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(31,44,65,0.14)]"
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/5 to-transparent" />
                <div className="relative p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                    {item.brand}
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-white leading-snug">
                      {item.name}
                    </span>
                    <HiArrowRight
                      className="text-white shrink-0 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
