import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResources } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import SectionHeader from "../../components/ui/SectionHeader";
import Reveal from "../../components/ui/Reveal";

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  guide: "Guide",
  catalog: "Catalog",
  video: "Video",
  brochure: "Brochure",
  manual: "Manual",
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params: { type?: string; search?: string } = {};
    if (type) params.type = type;
    if (search) params.search = search;
    getResources(params)
      .then(setResources)
      .catch(() => setResources([]))
      .finally(() => setLoaded(true));
  }, [type, search]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "E-Library" }]} />

      <div className="px-6 md:px-10 py-12">
        <SectionHeader
          eyebrow="Knowledge center"
          title="E-Library"
          description="Articles, clinical guides, catalogs, brochures and videos."
        />

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources"
            className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm border border-slate-200"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-white rounded-xl px-4 py-2.5 text-sm border border-slate-200"
          >
            <option value="">All types</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {!loaded ? (
          <p className="text-sm text-brand-muted">Loading...</p>
        ) : resources.length === 0 ? (
          <div className="bg-brand-tint rounded-2xl px-5 py-4 text-sm text-brand-blue max-w-lg">
            No resources published yet — articles, guides and catalogs added from the admin
            panel will appear here, searchable by type and keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resources.map((r, i) => (
              <Reveal key={r._id} delay={i * 0.06}>
                <Link
                  to={`/resources/${r.slug}`}
                  className="bg-white rounded-2xl overflow-hidden block hover:shadow-md transition-shadow h-full"
                >
                  <div className="h-32 bg-brand-tint flex items-center justify-center">
                    {r.coverImage ? (
                      <img src={r.coverImage} alt={r.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-brand-light text-3xl">📄</span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-brand-blue uppercase tracking-wide">
                      {TYPE_LABELS[r.type]}
                    </span>
                    <p className="font-medium text-brand-navy mt-1 mb-2">{r.title}</p>
                    <p className="text-xs text-brand-muted line-clamp-2">{r.summary}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
