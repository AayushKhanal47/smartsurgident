import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "../ui/Button";

export function ELibraryPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-navy py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-brand-light text-xs font-bold uppercase tracking-wider">
            Dental Knowledge Hub
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mt-2 mb-4">
            Learn, explore and stay updated
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-7 max-w-md">
            Access product catalogs, guides, articles and useful resources designed for
            dental professionals.
          </p>
          <ButtonLink to="/resources" variant="secondary">
            Explore E-Library
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-16 md:py-20">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-6 md:px-10 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
          Equip your practice with confidence.
        </h2>
        <p className="text-brand-slate text-sm md:text-base mb-8">
          Explore trusted dental and surgical products from brands professionals rely on.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <ButtonLink to="/products">Browse Products</ButtonLink>
          <ButtonLink to="/support/quote" variant="secondary">
            Request a Quote
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
