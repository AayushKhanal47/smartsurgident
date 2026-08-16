import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import { HiOutlineCube, HiOutlineTag, HiOutlineViewGrid, HiOutlineLocationMarker } from "react-icons/hi";
import heroImage from "../../assets/hero.png";

const STATS = [
  { icon: HiOutlineCube, label: "Products", value: "500+" },
  { icon: HiOutlineTag, label: "Brands", value: "50+" },
  { icon: HiOutlineViewGrid, label: "Categories", value: "20+" },
  { icon: HiOutlineLocationMarker, label: "Dealer Network", value: "Nationwide" },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: content */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, x: -24 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block bg-brand-tint text-brand-blue text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
            Nationwide Dealer Network
          </span>

          <h1 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-brand-navy leading-[1.15] mb-5">
            Advancing dentistry through{" "}
            <span className="text-brand-blue">trusted products</span> &amp; distribution
          </h1>

          <p className="text-brand-slate text-base leading-relaxed mb-8 max-w-md">
            Genuine dental and surgical instruments imported from China, India and beyond —
            verified, stocked, and delivered by dealers across Nepal.
          </p>

          <div className="flex gap-3 flex-wrap mb-10">
            <ButtonLink to="/products">Browse Catalog</ButtonLink>
            <ButtonLink to="/support/quote" variant="secondary">
              Request a Quote
            </ButtonLink>
          </div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-8 border-t border-brand-border max-w-lg"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <stat.icon className="text-brand-blue text-lg shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-brand-navy leading-tight">{stat.value}</p>
                  <p className="text-[11px] text-brand-slate leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: image */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden bg-brand-tint">
            <img
              src={heroImage}
              alt="Dental chair and equipment"
              className="w-full h-auto object-cover"
            />
          </div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg px-5 py-3.5 hidden sm:block"
          >
            <div className="flex gap-4 text-[11px] font-semibold text-brand-navy uppercase tracking-wide">
              <span>Quality</span>
              <span className="text-brand-border">|</span>
              <span>Trust</span>
              <span className="text-brand-border">|</span>
              <span>Service</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}