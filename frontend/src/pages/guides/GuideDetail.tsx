import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGuideBySlug } from "../../api/endpoints";
import type { Guide } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import PagePlaceholder from "../../components/PagePlaceholder";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { useStructuredData } from "../../hooks/useStructuredData";
import { articleSchema, breadcrumbSchema } from "../../utils/structuredData";

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoaded(false);
    setNotFound(false);
    getGuideBySlug(slug)
      .then(setGuide)
      .catch(() => setNotFound(true))
      .finally(() => setLoaded(true));
  }, [slug]);

  usePageMeta(guide ? `${guide.title} | Smart Surgident` : "", guide?.excerpt);
  useStructuredData(
    "ld-breadcrumb",
    guide
      ? breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: guide.title }])
      : null
  );
  useStructuredData("ld-article", guide ? articleSchema(guide) : null);

  if (notFound) {
    return (
      <PagePlaceholder
        title="Guide not found"
        description="This guide doesn't exist or is no longer published."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: "Guide" }]}
        note="Browse all guides instead."
      />
    );
  }

  if (!loaded || !guide) {
    return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: guide.title }]}
      />

      <Reveal className="px-6 md:px-10 py-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
          {new Date(guide.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold text-brand-navy">{guide.title}</h1>
        <p className="mt-4 text-brand-slate text-sm md:text-base leading-relaxed">{guide.excerpt}</p>

        <div className="mt-8 text-sm md:text-[15px] text-brand-slate leading-[1.8] whitespace-pre-line">
          {guide.body}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-brand-border pt-8">
          {guide.relatedCategorySlug && (
            <ButtonLink to={`/categories/${guide.relatedCategorySlug}`} variant="secondary">
              Browse this category
            </ButtonLink>
          )}
          <ButtonLink to="/support/quote">Request a quote</ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
