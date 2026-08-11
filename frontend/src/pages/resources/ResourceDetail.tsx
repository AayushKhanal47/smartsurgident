import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResourceBySlug } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  guide: "Guide",
  catalog: "Catalog",
  video: "Video",
  brochure: "Brochure",
  manual: "Manual",
};

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getResourceBySlug(slug)
      .then(setResource)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="px-6 md:px-10 py-16">
        <p className="text-sm text-brand-muted mb-4">Resource not found.</p>
        <Link to="/resources" className="text-brand-blue text-sm font-medium">
          &larr; Back to E-Library
        </Link>
      </div>
    );
  }
  if (!resource) {
    return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "E-Library", to: "/resources" },
          { label: resource.title },
        ]}
      />

      <Reveal className="px-6 md:px-10 py-12 max-w-2xl">
        <span className="text-xs font-semibold text-brand-blue uppercase tracking-wide">
          {TYPE_LABELS[resource.type]}
        </span>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mt-2 mb-4">
          {resource.title}
        </h1>
        <p className="text-brand-slate text-sm mb-6">{resource.summary}</p>

        {resource.body && (
          <div className="bg-white rounded-2xl p-6 text-sm text-brand-navy whitespace-pre-line mb-6">
            {resource.body}
          </div>
        )}

        {resource.videoUrl && (
          <div className="mb-6">
            <a
              href={resource.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue text-sm font-medium"
            >
              Watch video &rarr;
            </a>
          </div>
        )}

        {resource.fileUrl && (
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-brand-blue text-white hover:bg-brand-navy transition-colors"
          >
            Download
          </a>
        )}
      </Reveal>
    </div>
  );
}
