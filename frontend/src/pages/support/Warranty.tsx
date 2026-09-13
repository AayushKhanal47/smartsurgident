import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getPage } from "../../api/endpoints";
import type { Page } from "../../api/endpoints";

export default function SupportWarranty() {
  const [page, setPage] = useState<Page | null>(null);

  useEffect(() => {
    getPage("warranty").then(setPage).catch(() => setPage(null));
  }, []);

  usePageMeta("Warranty", "Warranty terms for equipment and instruments purchased through Smart Surgident.");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Support", to: "/support/contact" }, { label: "Warranty" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            {page?.title ?? "Warranty"}
          </h1>
          {(page?.body ?? "").split("\n\n").filter(Boolean).map((para, i) => (
            <p key={i} className="text-brand-slate text-sm md:text-base leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
