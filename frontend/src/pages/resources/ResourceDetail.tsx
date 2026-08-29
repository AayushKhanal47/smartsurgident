import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResourceBySlug } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [openingPdf, setOpeningPdf] = useState(false);
  const [openError, setOpenError] = useState("");

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

  const handleOpenPdf = async () => {
    if (!resource.fileUrl || openingPdf) return;

    setOpenError("");
    setOpeningPdf(true);

    const newTab = window.open("about:blank", "_blank");
    if (!newTab) {
      setOpeningPdf(false);
      setOpenError("Your browser blocked the new tab. Allow pop-ups for this site and try again.");
      return;
    }

    newTab.opener = null;

    newTab.document.write(
      "<title>Opening catalog PDF...</title><p style='font-family:sans-serif;padding:24px'>Opening catalog PDF...</p>"
    );

    try {
      const response = await fetch(resource.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to load PDF (${response.status})`);
      }

      const blob = await response.blob();
      const pdfBlob = blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);
      newTab.location.href = blobUrl;
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch {
      newTab.close();
      setOpenError("This PDF could not be opened. Re-upload the catalog PDF and try again.");
    } finally {
      setOpeningPdf(false);
    }
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "E-Library", to: "/resources" },
          { label: resource.title },
        ]}
      />

      <Reveal className="px-6 md:px-10 py-12 max-w-3xl">
        {resource.coverImage && (
          <div className="h-56 md:h-72 bg-brand-tint rounded-3xl overflow-hidden mb-8">
            <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mt-2 mb-4">
          {resource.title}
        </h1>
        <p className="text-brand-slate text-sm mb-6">{resource.summary}</p>

        {resource.fileUrl && (
          <button
            type="button"
            onClick={handleOpenPdf}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-brand-blue text-white hover:bg-brand-navy transition-colors"
          >
            {openingPdf ? "Opening..." : "Open Catalog PDF"}
          </button>
        )}
        {openError && <p className="mt-3 text-sm text-red-500">{openError}</p>}
      </Reveal>
    </div>
  );
}
