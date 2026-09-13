import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { HiOutlineTruck, HiOutlinePhone, HiOutlineChartBar, HiOutlineSupport } from "react-icons/hi";

// DRAFT COPY — see About.tsx for the same note. These are generic role
// *areas*, not confirmed open positions — do not present this as an active
// job listing until real openings and an application process exist.
const AREAS = [
  { icon: HiOutlineChartBar, title: "Sales & Business Development", body: "Growing our dealer network and clinic relationships city by city." },
  { icon: HiOutlineTruck, title: "Warehouse & Logistics", body: "Inspection, packaging, and dispatch for equipment moving nationwide." },
  { icon: HiOutlinePhone, title: "Customer & Dealer Support", body: "Helping clinics and dealers get the right equipment and answers, fast." },
  { icon: HiOutlineSupport, title: "Technical / Service", body: "Installation guidance and after-sales support for dental and surgical equipment." },
];

export default function CompanyCareers() {
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
            rely on — from sourcing to nationwide delivery and support. We don't have specific
            openings listed right now, but here's the kind of work that keeps this running.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {AREAS.map((a) => (
              <div key={a.title} className="flex gap-4">
                <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-brand-tint text-brand-primary">
                  <a.icon className="text-lg" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{a.title}</p>
                  <p className="mt-1 text-sm text-brand-slate leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="rounded-2xl border border-brand-border px-6 py-8">
          <p className="text-sm font-semibold text-brand-navy">Think you'd be a fit?</p>
          <p className="mt-1.5 text-sm text-brand-slate">
            Send your CV and a short note about what you'd want to work on — we'll reach out if
            something opens up that matches.
          </p>
          <div className="mt-5">
            <ButtonLink to="/support/contact">Get in touch</ButtonLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
