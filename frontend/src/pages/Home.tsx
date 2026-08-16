import { useEffect, useState } from "react";
import { getProducts } from "../api/endpoints";
import type { Product } from "../api/endpoints";

import Hero from "../components/home/Hero";
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
  {
    label: "Hand instruments",
    icon: HiOutlineScissors,
    slug: "hand-instruments",
  },
  {
    label: "Rotary & burs",
    icon: HiOutlineCog,
    slug: "rotary-burs",
  },
  {
    label: "Chairside materials",
    icon: HiOutlineBeaker,
    slug: "chairside-materials",
  },
  {
    label: "Sterilization",
    icon: HiOutlineSparkles,
    slug: "sterilization",
  },
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((products) => setBestSellers(products.slice(0, 4)))
      .catch(() => setBestSellers([]));
  }, []);

  return (
    <div>
      {/* =========================================================
          HERO
          ========================================================= */}
      <Hero />

      {/* =========================================================
          SOLUTION AREAS
          ========================================================= */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <SectionHeader eyebrow="What we supply" title="Solution areas" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category, index) => (
            <Reveal key={category.label} delay={index * 0.08}>
              <a
                href={`/categories/${category.slug}`}
                className="bg-white rounded-2xl p-6 text-center block hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-tint flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-blue transition-colors">
                  <category.icon
                    className="text-xl text-brand-blue group-hover:text-white transition-colors"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm font-medium text-brand-navy">
                  {category.label}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================
          BEST SELLERS
          ========================================================= */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <SectionHeader
          eyebrow="From the catalog"
          title="Best sellers"
          action={
            <ButtonLink to="/products" variant="ghost">
              View all →
            </ButtonLink>
          }
        />

        {bestSellers.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No products yet — add some from the admin panel to see them here.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((product, index) => (
              <Reveal key={product._id} delay={index * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          WHY SMART SURGIDENT
          ========================================================= */}
      <section className="px-6 md:px-10 py-16 max-w-[1400px] mx-auto">
        <SectionHeader
          eyebrow="Why Smart Surgident"
          title="Built for clinics that need it done right"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verified Imports */}
          <Reveal>
            <div className="bg-white rounded-2xl p-7 h-full">
              <HiOutlineShieldCheck
                className="text-2xl text-brand-blue mb-4"
                aria-hidden="true"
              />

              <p className="font-semibold text-brand-navy mb-2">
                Verified imports
              </p>

              <p className="text-sm text-brand-slate">
                Every product is sourced and verified before it reaches a
                dealer&apos;s shelf.
              </p>
            </div>
          </Reveal>

          {/* Dealer Network */}
          <Reveal delay={0.08}>
            <div className="bg-white rounded-2xl p-7 h-full">
              <HiOutlineLocationMarker
                className="text-2xl text-brand-blue mb-4"
                aria-hidden="true"
              />

              <p className="font-semibold text-brand-navy mb-2">
                Local dealer network
              </p>

              <p className="text-sm text-brand-slate">
                Orders route straight to the authorized dealer in your city
                for fulfillment.
              </p>
            </div>
          </Reveal>

          {/* E-Library */}
          <Reveal delay={0.16}>
            <div className="bg-white rounded-2xl p-7 h-full">
              <HiOutlineBookOpen
                className="text-2xl text-brand-blue mb-4"
                aria-hidden="true"
              />

              <p className="font-semibold text-brand-navy mb-2">
                E-Library
              </p>

              <p className="text-sm text-brand-slate">
                Full specifications and documentation for every product we
                carry.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}