import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import { useBannerSource } from "../../hooks/useBannerSource";
import type { ResolvedBanner } from "../../hooks/useBannerSource";
import type { PromoBanner } from "../../data/homepage";

// Large editorial product showcase. Data-driven: give it a PromoBanner config
// and it pulls the image + name from live catalogue data. Renders nothing if
// the referenced item (or its image) doesn't exist.
export default function ProductPromoBanner({ banner, tinted = false }: { banner: PromoBanner; tinted?: boolean }) {
  const { data, loading } = useBannerSource(banner.source);
  if (loading || !data || !data.image) return null;
  return <PromoBannerView banner={banner} data={data} image={data.image} tinted={tinted} />;
}

function PromoBannerView({
  banner,
  data,
  image,
  tinted,
}: {
  banner: PromoBanner;
  data: ResolvedBanner;
  image: string;
  tinted: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const imageLeft = banner.imageSide === "left";

  const media = (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden bg-white shadow-[0_30px_80px_-32px_rgba(31,44,65,0.32)]"
    >
      <div className="aspect-[4/3] md:aspect-[5/4] overflow-hidden">
        <motion.img
          src={image}
          alt={data.title}
          loading="lazy"
          decoding="async"
          style={reduceMotion ? undefined : { y }}
          className="w-full h-[112%] object-cover will-change-transform"
        />
      </div>
    </motion.div>
  );

  const copy = (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-lg"
    >
      <span className="eyebrow">{banner.eyebrow}</span>
      <h2 className="display-2 mt-3 text-brand-navy">{banner.headline}</h2>
      <p className="mt-5 text-[15px] md:text-base leading-relaxed text-brand-slate">{banner.body}</p>
      {(data.brandName || data.price) && (
        <p className="mt-5 text-xs uppercase tracking-[0.1em] text-brand-muted">
          {[data.brandName, data.price ? `Rs ${data.price.toLocaleString()}` : null].filter(Boolean).join("  ·  ")}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to={banner.primaryCta.to}>{banner.primaryCta.label}</ButtonLink>
        {banner.secondaryCta && (
          <ButtonLink to={banner.secondaryCta.to} variant="secondary">
            {banner.secondaryCta.label}
          </ButtonLink>
        )}
      </div>
    </motion.div>
  );

  return (
    <section ref={ref} className={tinted ? "bg-brand-bg" : "bg-white"}>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {imageLeft ? (
          <>
            {media}
            <div className="md:pl-4">{copy}</div>
          </>
        ) : (
          <>
            <div className="md:order-2">{media}</div>
            <div className="md:order-1 md:pr-4">{copy}</div>
          </>
        )}
      </div>
    </section>
  );
}
