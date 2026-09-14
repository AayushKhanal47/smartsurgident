import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGuides } from "../../api/endpoints";
import type { Guide } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";
import { useStructuredData } from "../../hooks/useStructuredData";
import { breadcrumbSchema } from "../../utils/structuredData";

export default function Guides() {
  usePageMeta(
    "Dental Equipment Guides | Smart Surgident",
    "Buying guides and equipment advice for dental clinics in Nepal — how to choose the right chairs, imaging, endodontic and sterilization equipment."
  );
  useStructuredData("ld-breadcrumb", breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Guides" }]));

  const [guides, setGuides] = useState<Guide[] | null>(null);

  useEffect(() => {
    getGuides().then(setGuides).catch(() => setGuides([]));
  }, []);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            Equipment guides
          </h1>
          <p className="text-brand-slate text-sm md:text-base mb-10">
            Practical advice for clinics in Nepal choosing, comparing and setting up dental
            equipment — drawn from the equipment we actually distribute.
          </p>
        </Reveal>

        {guides && guides.length === 0 && (
          <p className="text-sm text-brand-muted">No guides published yet — check back soon.</p>
        )}

        <div className="flex flex-col divide-y divide-brand-border">
          {guides?.map((guide, i) => (
            <Reveal key={guide._id} delay={i * 0.05} className="py-6 first:pt-0">
              <Link to={`/guides/${guide.slug}`} className="group block">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  {new Date(guide.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
                <p className="mt-1.5 text-base font-display font-semibold text-brand-navy group-hover:text-brand-primary transition-colors">
                  {guide.title}
                </p>
                <p className="mt-1.5 text-sm text-brand-slate leading-relaxed">{guide.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
