import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import { hero, servingCities } from "../../data/homepage";
import heroImage from "../../assets/hero.jpg";

// MAIN HERO — the dental treatment unit (src/assets/hero.jpg) is the section
// background; navy copy sits over a white scrim on the left so it stays
// readable while the chair shows through on the right. Background parallaxes
// on scroll; copy staggers in on load.
export default function ProductHeroBanner() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
        };

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-[#EAF2F8]">
      {/* Background image */}
      <motion.img
        src={heroImage}
        alt="Dental treatment unit in a modern clinic"
        width={1536}
        height={1024}
        style={reduceMotion ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[72%_center] will-change-transform"
      />
      {/* Readability scrims: strong from the left on desktop, top-down on mobile */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/92 to-white/10 md:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white/70 via-transparent to-transparent md:hidden" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 flex items-center min-h-[78vh] md:min-h-[86vh] py-20">
        <div className="relative max-w-xl">
          <motion.p {...fade(0)} className="eyebrow">
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...fade(0.08)} className="display-1 mt-4 text-brand-navy">
            {hero.headline}{" "}
            <span className="text-brand-primary">{hero.headlineAccent}</span>{" "}
            {hero.headlineTail}
          </motion.h1>
          <motion.p {...fade(0.16)} className="mt-6 text-[15px] sm:text-base leading-relaxed text-brand-slate max-w-md">
            {hero.body}
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={hero.primaryCta.to}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink to={hero.secondaryCta.to} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </motion.div>
          <motion.p {...fade(0.32)} className="mt-10 text-xs uppercase tracking-[0.14em] text-brand-muted">
            Serving {servingCities.join(" · ")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
