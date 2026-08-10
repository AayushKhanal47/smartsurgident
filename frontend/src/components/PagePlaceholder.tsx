import Breadcrumbs from "./ui/Breadcrumbs";
import Reveal from "./ui/Reveal";

interface Crumb {
  label: string;
  to?: string;
}

interface PagePlaceholderProps {
  title: string;
  description: string;
  breadcrumbs: Crumb[];
  note?: string;
}

// Used for pages whose structure is built but whose real content (company
// history, dealer info, articles, etc.) hasn't been provided yet — keeps the
// route live and styled without inventing facts, per the "no fabricated
// content" requirement.
export default function PagePlaceholder({
  title,
  description,
  breadcrumbs,
  note = "This section is structured and ready — real content will appear here once it's provided.",
}: PagePlaceholderProps) {
  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            {title}
          </h1>
          <p className="text-brand-slate text-sm md:text-base mb-6">{description}</p>
          <div className="bg-brand-tint rounded-2xl px-5 py-4 text-sm text-brand-blue">
            {note}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
