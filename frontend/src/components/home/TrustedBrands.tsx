import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { getBrands } from "../../api/endpoints";
import type { Brand } from "../../api/endpoints";

function BrandMark({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/brands/${brand.slug}`}
      className="flex items-center justify-center h-14 px-6 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
      title={brand.name}
    >
      {brand.logoUrl ? (
        <img src={brand.logoUrl} alt={brand.name} loading="lazy" className="max-h-10 max-w-[140px] object-contain" />
      ) : (
        <span className="font-display text-lg font-semibold text-brand-navy whitespace-nowrap">{brand.name}</span>
      )}
    </Link>
  );
}

// FEATURED BRANDS — quiet wordmark row. Marquee only when there are enough
// logos to warrant it.
export default function TrustedBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  if (brands.length === 0) return null;
  const marquee = brands.length > 5;

  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs uppercase tracking-[0.16em] text-brand-muted"
        >
          Brands we carry
        </motion.p>

        {marquee ? (
          <div className="relative mt-8">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="brand-marquee flex gap-6 w-max">
              {[...brands, ...brands].map((b, i) => (
                <BrandMark key={`${b._id}-${i}`} brand={b} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {brands.map((b) => (
              <BrandMark key={b._id} brand={b} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
