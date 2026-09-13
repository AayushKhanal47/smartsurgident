import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getPage } from "../../api/endpoints";
import type { Page } from "../../api/endpoints";
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineClipboardCheck } from "react-icons/hi";

const CAPABILITIES = [
  {
    icon: HiOutlineClipboardCheck,
    title: "Inbound quality inspection",
    body: "Equipment is checked against spec on arrival before it's listed as available stock, so what a clinic orders matches what ships.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Careful handling & storage",
    body: "Imaging systems, dental units, and delicate handpieces are stored and packaged to survive transport across Nepal's terrain, not just a warehouse shelf.",
  },
  {
    icon: HiOutlineTruck,
    title: "Dispatch to your dealer's city",
    body: "Stock is routed to the dealer assigned to your city at checkout, keeping delivery times shorter than a single-warehouse model would allow.",
  },
];

export default function CompanyFacilities() {
  const [page, setPage] = useState<Page | null>(null);

  useEffect(() => {
    getPage("facilities").then(setPage).catch(() => setPage(null));
  }, []);

  usePageMeta(
    "Our Facilities",
    "A look at Smart Surgident's warehouse, inspection, and distribution operations behind the dealer network across Nepal."
  );

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "Facilities" }]} />

      <div className="px-6 md:px-10 py-16 max-w-3xl">
        <Reveal>
          <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">Behind the scenes</span>
          <h1 className="mt-3 text-2xl md:text-4xl font-display font-bold text-brand-navy leading-tight">
            {page?.title ?? "Our Facilities"}
          </h1>
          {(page?.body ?? "").split("\n\n").filter(Boolean).map((para, i) => (
            <p key={i} className="mt-5 text-brand-slate text-sm md:text-base leading-relaxed">
              {para}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="grid sm:grid-cols-3 gap-6">
            {CAPABILITIES.map((c) => (
              <div key={c.title}>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-tint text-brand-primary mb-3">
                  <c.icon className="text-lg" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-brand-navy">{c.title}</p>
                <p className="mt-1 text-sm text-brand-slate leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 flex flex-wrap gap-3">
          <ButtonLink to="/dealers">See our dealer network</ButtonLink>
          <ButtonLink to="/support/contact" variant="secondary">
            Ask about a visit
          </ButtonLink>
        </Reveal>
      </div>
    </div>
  );
}
