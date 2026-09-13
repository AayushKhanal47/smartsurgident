import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";

// DRAFT COPY — see About.tsx for the same note. Every entry's date and
// specifics are placeholders; replace with real announcements as they
// happen, and delete any entry that isn't actually true.
const UPDATES = [
  {
    date: "[Month Year]",
    title: "New brands added to the catalogue",
    body: "Our product range now spans dental chairs, imaging and CBCT systems, endodontic motors, and sterilization equipment from an expanding list of manufacturers.",
  },
  {
    date: "[Month Year]",
    title: "Dealer network reaches a new city",
    body: "A new authorised dealer joined the network, extending same-city order routing and support to another region of Nepal.",
  },
  {
    date: "[Month Year]",
    title: "E-Library expanded with more catalogues",
    body: "More product manuals and specification sheets were added to the E-Library, making it easier to check details before ordering.",
  },
];

export default function CompanyNews() {
  usePageMeta("News & Updates", "Announcements and updates from Smart Surgident.");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "News" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            News & updates
          </h1>
          <p className="text-brand-slate text-sm md:text-base mb-10">
            What's new at Smart Surgident — new brands, new dealer cities, and platform updates.
          </p>
        </Reveal>

        <div className="flex flex-col divide-y divide-brand-border">
          {UPDATES.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.05} className="py-6 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{u.date}</p>
              <p className="mt-1.5 text-base font-display font-semibold text-brand-navy">{u.title}</p>
              <p className="mt-1.5 text-sm text-brand-slate leading-relaxed">{u.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
