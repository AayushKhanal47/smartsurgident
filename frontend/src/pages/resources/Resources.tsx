import { useEffect, useState } from "react";
import { getResources } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import SectionHeader from "../../components/ui/SectionHeader";
import Reveal from "../../components/ui/Reveal";
import { getPdfThumbnail } from "../../utils/pdfThumbnail";
import { usePageMeta } from "../../hooks/usePageMeta";

export default function Resources() {
  usePageMeta(
    "E-Library",
    "Specifications, manuals and product catalogues for the dental and surgical equipment Smart Surgident distributes across Nepal."
  );

  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params: { search?: string } = {};
    if (search) params.search = search;
    getResources(params)
      .then(setResources)
      .catch(() => setResources([]))
      .finally(() => setLoaded(true));
  }, [search]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "E-Library" }]} />

      <div className="px-6 md:px-10 py-12">
        <SectionHeader
          eyebrow="Product catalogs"
          title="Product Catalogue"
          description="Browse and view our product catalogs."
        />

        <div className="mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalogs"
            className="w-full max-w-md bg-white rounded-xl px-4 py-2.5 text-sm border border-slate-200"
          />
        </div>

        {!loaded ? (
          <p className="text-sm text-brand-muted">Loading...</p>
        ) : resources.length === 0 ? (
          <div className="bg-brand-tint rounded-2xl px-5 py-4 text-sm text-brand-blue max-w-lg">
            No catalog PDFs published yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-5">
            {resources.map((r, i) => (
              <Reveal key={r._id} delay={i * 0.05}>
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-md hover:border-brand-blue/40 transition-all">
                  <div className="aspect-[3/4] bg-brand-tint flex items-center justify-center overflow-hidden">
                    {(r.coverImage || getPdfThumbnail(r.fileUrl)) ? (
                      <img src={r.coverImage || getPdfThumbnail(r.fileUrl)!} alt={r.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-brand-light text-2xl">📄</span>
                    )}
                  </div>
                  <div className="p-2.5 text-center">
                    <p className="font-medium text-brand-navy text-xs truncate">{r.title}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
