import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineCog, HiOutlineBadgeCheck, HiOutlineTruck } from "react-icons/hi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import heroImage from "../../assets/hero.png";

const FEATURES = [
  { icon: HiOutlineCog, label: "Precision Equipment" },
  { icon: HiOutlineWrenchScrewdriver, label: "Professional Instruments" },
  { icon: HiOutlineBadgeCheck, label: "Trusted Brands" },
  { icon: HiOutlineTruck, label: "Reliable Supply" },
];

export default function ClinicShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#F7FAFD] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden order-2 md:order-1"
        >
          <img src={heroImage} alt="Modern dental clinic equipment" className="w-full h-auto object-cover" />
        </motion.div>

        <div className="order-1 md:order-2">
          <span className="text-[#17699A] text-xs font-bold uppercase tracking-wider">
            Built For Modern Clinics
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0D2947] mt-2 mb-8 leading-snug">
            Everything your practice needs. From equipment to everyday essentials.
          </h2>

          <div className="grid grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <f.icon className="text-[#17699A] text-base" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-[#0D2947]">{f.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
