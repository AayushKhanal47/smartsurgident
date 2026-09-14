import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.smartsurgident.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

// Sets this page's <title>, meta description, canonical URL, and
// Open Graph/Twitter tags. Previously this only touched title/description —
// every product/brand/category/dealer page silently kept index.html's
// static homepage canonical and OG data, so Google saw every page as a
// duplicate of "/" and a shared product link showed the homepage's card
// (SEO audit finding, P0). Canonical is derived from the router location
// rather than passed in, so existing 2-arg call sites don't need to change;
// pass `image` only where a page has one worth sharing (product, brand).
//
// No cleanup-on-unmount by design — the next page's own usePageMeta call
// naturally overwrites these; resetting on unmount would just cause a flash
// of the wrong title/canonical during route transitions.
export function usePageMeta(title: string, description?: string, image?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!title) return;
    const fullTitle = title.includes("Smart Surgident") ? title : `${title} | Smart Surgident`;
    document.title = fullTitle;

    const normalizedPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");
    const canonicalUrl = `${SITE_URL}${normalizedPath}`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", image || DEFAULT_OG_IMAGE);
    setMetaTag("name", "twitter:image", image || DEFAULT_OG_IMAGE);

    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
      setMetaTag("name", "twitter:description", description);
    }
  }, [title, description, image, pathname]);
}
