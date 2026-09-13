import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  HiOutlineBadgeCheck,
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
  HiOutlineLightBulb,
} from "react-icons/hi";

// DRAFT COPY — written to give this page a real structure and voice instead
// of the "coming soon" placeholder. The narrative is grounded in what the
// platform actually does (dealer network, brand portfolio, clinic pricing),
// but [bracketed] specifics (founding year, team size, etc.) are invented
// placeholders and must be corrected by Smart Surgident before this is
// treated as published fact.
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
            Genuine equipment, delivered wherever your clinic is.
          </h1>
          <p className="mt-5 text-brand-slate text-sm md:text-base leading-relaxed">
            Smart Surgident was started to solve a simple problem: dental and surgical clinics
            outside the biggest cities in Nepal often had no direct, reliable way to buy genuine
            equipment — and no one to call when something needed servicing after the sale.
            [Founded in YEAR], we built a distribution model around city-based dealers instead of
            a single storefront, so clinics in Kathmandu, Pokhara, Chitwan, Butwal, Biratnagar, and
            the cities we add next all have someone local to order from and turn to for support.
          </p>
          <p className="mt-4 text-brand-slate text-sm md:text-base leading-relaxed">
            Today we distribute equipment across dental chairs and units, imaging and CBCT
            systems, endodontic motors, handpieces, sterilization, and consumables — importing
            directly from manufacturers we work with, and passing that directness on as genuine
            products, documented specifications, and pricing clinics can actually plan around.
          </p>
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
