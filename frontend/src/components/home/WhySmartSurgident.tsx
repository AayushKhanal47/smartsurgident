import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineShieldCheck, HiOutlineBadgeCheck, HiOutlineChatAlt2, HiOutlineTruck } from "react-icons/hi";

const FEATURES = [
  {
    icon: HiOutlineShieldCheck,
    title: "Genuine Products",
    description: "Verified and quality-focused products.",
  },
  {
    icon: HiOutlineBadgeCheck,
    title: "Trusted Brands",
    description: "Products from recognized dental and healthcare manufacturers.",
  },
  {
    icon: HiOutlineChatAlt2,
    title: "Professional Support",
    description: "Guidance before and after purchase.",
  },
  {
    icon: HiOutlineTruck,
    title: "Reliable Supply",
    description: "Dependable distribution across Nepal.",
  },
];

export default function WhySmartSurgident() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-tint py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">
            Why Smart Surgident
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mt-2">
            Built for clinics that need it done right
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-tint flex items-center justify-center mb-4">
                <f.icon className="text-lg text-brand-blue" aria-hidden="true" />
              </div>
              <p className="font-semibold text-brand-navy mb-1.5">{f.title}</p>
              <p className="text-sm text-brand-slate">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
