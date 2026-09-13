import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getPage } from "../../api/endpoints";
import type { Page } from "../../api/endpoints";
import {
  HiOutlineBadgeCheck,
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
  HiOutlineLightBulb,
} from "react-icons/hi";

const VALUES = [
  {
    icon: HiOutlineBadgeCheck,
    title: "Genuine equipment, always",
    body: "Every product we distribute is sourced directly from the manufacturer or an authorised channel — no grey-market imports, no substitutions.",
  },
  {
    icon: HiOutlineGlobeAlt,
    title: "Nationwide reach",
    body: "A growing network of city-based dealers means clinics outside Kathmandu get the same access to equipment, spares, and support as those in the capital.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Support that outlasts the sale",
    body: "From installation guidance to spare parts and service documentation, our E-Library and dealer network stay with a clinic long after the order ships.",
  },
  {
    icon: HiOutlineLightBulb,
    title: "Built for how clinics actually buy",
    body: "Transparent retail pricing, discounted clinic-verified pricing, and a quote-first path for larger equipment — whichever fits how you procure.",
  },
];

export default function CompanyAbout() {
  const [page, setPage] = useState<Page | null>(null);

  useEffect(() => {
    getPage("about").then(setPage).catch(() => setPage(null));
  }, []);

  usePageMeta(
    "About Us",
    "Smart Surgident distributes genuine dental and surgical equipment across Nepal through a growing network of city-based dealers."
  );

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "About" }]} />

      <div className="px-6 md:px-10 py-16 max-w-3xl">
        <Reveal>
          <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">Our story</span>
          <h1 className="mt-3 text-2xl md:text-4xl font-display font-bold text-brand-navy leading-tight">
            {page?.title ?? "About Smart Surgident"}
          </h1>
          {(page?.body ?? "").split("\n\n").filter(Boolean).map((para, i) => (
            <p key={i} className="mt-5 text-brand-slate text-sm md:text-base leading-relaxed">
              {para}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <h2 className="text-lg font-display font-bold text-brand-navy mb-6">What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4">
                <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-brand-tint text-brand-primary">
                  <v.icon className="text-lg" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{v.title}</p>
                  <p className="mt-1 text-sm text-brand-slate leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 flex flex-wrap gap-3">
          <ButtonLink to="/products">Browse the catalogue</ButtonLink>
          <ButtonLink to="/dealers" variant="secondary">
            Find your local dealer
          </ButtonLink>
        </Reveal>
      </div>
    </div>
  );
}
