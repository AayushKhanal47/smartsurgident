import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getJobOpenings } from "../../api/endpoints";
import type { JobOpening } from "../../api/endpoints";

export default function CompanyCareers() {
  const [openings, setOpenings] = useState<JobOpening[] | null>(null);

  useEffect(() => {
    getJobOpenings().then(setOpenings).catch(() => setOpenings([]));
  }, []);

  usePageMeta("Careers", "Join the Smart Surgident team distributing dental and surgical equipment across Nepal.");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "Careers" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            Careers
          </h1>
          <p className="text-brand-slate text-sm md:text-base leading-relaxed mb-10">
            We're building the equipment supply chain that Nepal's dental and surgical clinics
            rely on — from sourcing to nationwide delivery and support.
          </p>
        </Reveal>

        {openings && openings.length === 0 && (
          <Reveal delay={0.1} className="rounded-2xl border border-brand-border px-6 py-8">
            <p className="text-sm font-semibold text-brand-navy">No openings listed right now</p>
            <p className="mt-1.5 text-sm text-brand-slate">
              Send your CV and a short note about what you'd want to work on — we'll reach out if
              something opens up that matches.
            </p>
            <div className="mt-5">
              <ButtonLink to="/support/contact">Get in touch</ButtonLink>
            </div>
          </Reveal>
        )}

        <div className="flex flex-col gap-4">
          {openings?.map((job, i) => (
            <Reveal key={job._id} delay={i * 0.05} className="rounded-2xl border border-brand-border px-6 py-6">
              <p className="text-base font-display font-semibold text-brand-navy">{job.title}</p>
              <p className="mt-1 text-xs text-brand-muted">
                {[job.location, job.employmentType].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-3 text-sm text-brand-slate leading-relaxed whitespace-pre-line">{job.body}</p>
              <div className="mt-4">
                <ButtonLink to="/support/contact" variant="secondary">
                  Apply
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
