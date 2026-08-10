import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getProducts } from "../api/endpoints";
import type { Product } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/ui/SectionHeader";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import {
  HiOutlineScissors,
  HiOutlineCog,
  HiOutlineBeaker,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineLocationMarker,
  HiOutlineBookOpen,
} from "react-icons/hi";

const CATEGORIES = [
  { label: "Hand instruments", icon: HiOutlineScissors, slug: "hand-instruments" },
  { label: "Rotary & burs", icon: HiOutlineCog, slug: "rotary-burs" },
  { label: "Chairside materials", icon: HiOutlineBeaker, slug: "chairside-materials" },
  { label: "Sterilization", icon: HiOutlineSparkles, slug: "sterilization" },
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getProducts()
      .then((products) => setBestSellers(products.slice(0, 4)))
      .catch(() => setBestSellers([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="text-center px-6 py-20 md:py-28 bg-gradient-to-b from-brand-tint/60 to-transparent">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block bg-brand-tint text-brand-blue text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-6">
            Nationwide dealer network
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-navy leading-tight mb-4 max-w-3xl mx-auto">
            Advancing dentistry through trusted products &amp; distribution
          </h1>
          <p className="text-brand-slate max-w-xl mx-auto mb-8 text-sm md:text-base">
            Genuine dental and surgical instruments imported from China, India and beyond —
            verified, stocked, and delivered by dealers across Nepal.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <ButtonLink to="/products">Browse catalog</ButtonLink>
            <ButtonLink to="/support/quote" variant="secondary">
              Request a Quote
            </ButtonLink>
          </div>
        </motion.div>
      </section>

      {/* Solution categories */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <SectionHeader eyebrow="What we supply" title="Solution areas" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <a
                href={`/categories/${c.slug}`}
                className="bg-white rounded-2xl p-6 text-center block hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-tint flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-blue transition-colors">
                  <c.icon className="text-xl text-brand-blue group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-brand-navy">{c.label}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <SectionHeader
          eyebrow="From the catalog"
          title="Best sellers"
          action={<ButtonLink to="/products" variant="ghost">View all &rarr;</ButtonLink>}
        />
        {bestSellers.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No products yet — add some from the admin panel to see them here.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Why Smart Surgident */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <SectionHeader eyebrow="Why Smart Surgident" title="Built for clinics that need it done right" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal>
            <div className="bg-white rounded-2xl p-7 h-full">
              <HiOutlineShieldCheck className="text-2xl text-brand-blue mb-4" aria-hidden="true" />
              <p className="font-semibold text-brand-navy mb-2">Verified imports</p>
              <p className="text-sm text-brand-slate">
                Every product is sourced and verified before it reaches a dealer's shelf.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="bg-white rounded-2xl p-7 h-full">
              <HiOutlineLocationMarker className="text-2xl text-brand-blue mb-4" aria-hidden="true" />
              <p className="font-semibold text-brand-navy mb-2">Local dealer network</p>
              <p className="text-sm text-brand-slate">
                Orders route straight to the authorized dealer in your city for fulfillment.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="bg-white rounded-2xl p-7 h-full">
              <HiOutlineBookOpen className="text-2xl text-brand-blue mb-4" aria-hidden="true" />
              <p className="font-semibold text-brand-navy mb-2">E-Library</p>
              <p className="text-sm text-brand-slate">
                Full specifications and documentation for every product we carry.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="bg-brand-navy rounded-3xl px-8 py-12 md:py-16 text-center">
            <h2 className="text-white text-2xl md:text-3xl font-display font-bold mb-3">
              Looking to become a dealer?
            </h2>
            <p className="text-slate-300 text-sm md:text-base mb-7 max-w-lg mx-auto">
              Join the Smart Surgident distribution network and bring genuine dental supplies
              to clinics in your city.
            </p>
            <ButtonLink to="/support/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
