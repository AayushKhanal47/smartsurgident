import { motion, useReducedMotion } from "framer-motion";
import { whyPoints } from "../../data/homepage";

// WHY SMART SURGIDENT — editorial two-column: a confident statement on the
// left, a concise verified list on the right. No icon-chip grid.
export default function WhySmartSurgident() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-bg py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:pt-2"
        >
          <span className="eyebrow">Why Smart Surgident</span>
          <h2 className="display-2 mt-3 text-brand-navy">
            A supply partner clinics can rely on
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-relaxed text-brand-slate max-w-md">
            We focus on genuine equipment, honest guidance and dependable support —
            before and long after the sale.
          </p>
        </motion.div>

        <div>
          {whyPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06 }}
              className="flex gap-5 border-b border-brand-border py-5 first:pt-0 last:border-0"
            >
              <span className="font-display text-sm font-semibold text-brand-primary tabular-nums pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-brand-navy">{point.title}</p>
                <p className="mt-1 text-sm text-brand-slate leading-relaxed">{point.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
