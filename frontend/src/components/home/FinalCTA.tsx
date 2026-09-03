import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import clinicBg from "../../assets/clinic-planning-bg.jpg";

// FINAL CTA — the single full-width dark moment on the page.
export default function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-black overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${clinicBg})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75"
        aria-hidden="true"
      />
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-[1240px] mx-auto px-5 sm:px-8 py-24 md:py-32 text-center"
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
          Clinic planning &amp; equipment advice
        </span>
        <h2 className="display-2 mt-4 !text-white max-w-2xl mx-auto drop-shadow-sm">
          Planning a new clinic, or upgrading your setup?
        </h2>
        <p className="mt-5 text-[15px] md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
          Share your requirements and our team will help you choose the right equipment,
          plan the layout, and arrange delivery to your city.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <ButtonLink to="/support/quote" variant="onDark">
            Talk to an Expert
          </ButtonLink>
          <ButtonLink to="/products" variant="outlineDark">
            Browse the catalogue
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
