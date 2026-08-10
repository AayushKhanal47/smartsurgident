import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string; // last crumb typically has no `to` (current page)
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="px-6 md:px-10 pt-6 text-xs text-brand-muted">
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-brand-blue transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-navy font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
