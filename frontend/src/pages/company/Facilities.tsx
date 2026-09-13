import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { HiOutlineLocationMarker, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineClipboardCheck } from "react-icons/hi";

// DRAFT COPY — see About.tsx for the same note. [Bracketed] specifics
// (address, size, city coverage) are placeholders, not verified facts.
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
            Our facilities
          </h1>
          <p className="mt-5 text-brand-slate text-sm md:text-base leading-relaxed">
            Our central warehouse and office in [Kathmandu / neighbourhood], Nepal, is where every
            piece of equipment we distribute is received, inspected, and prepared before it
            reaches a dealer or a clinic directly. As our dealer network grows to more cities, this
            facility is what keeps stock consistent and quality checks the same no matter where an
            order ships to.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex items-center gap-3 mb-6 text-sm text-brand-navy font-medium">
            <HiOutlineLocationMarker className="text-brand-primary text-lg shrink-0" aria-hidden="true" />
            [Street address], [City], Nepal
          </div>
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
