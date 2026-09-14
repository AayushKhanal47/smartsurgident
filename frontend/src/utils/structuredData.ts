import type { Dealer, Guide, Product, SiteSettings } from "../api/endpoints";

export const SITE_URL = "https://www.smartsurgident.com";
const ORG_NAME = "Smart Surgident Pvt. Ltd.";

interface Crumb {
  label: string;
  to?: string;
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${SITE_URL}${item.to === "/" ? "" : item.to}` } : {}),
    })),
  };
}

// Only the fields that are genuinely known — no fabricated street address,
// rating, or certification. `settings` comes from the same public
// /api/site-settings the Footer already displays, so this can never drift
// from what a visitor sees on the page.
export function organizationSchema(settings: SiteSettings | null) {
  if (!settings) return null;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-32.png`,
    image: `${SITE_URL}/og-image.jpg`,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.address,
      addressCountry: "NP",
    },
  };
}

// The navbar's search box genuinely navigates to /products?search=... —
// this SearchAction describes real functionality, not an aspirational one.
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Smart Surgident",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: Product) {
  const hasPrice = typeof product.price === "number" && product.price > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.slice(0, 500),
    image: product.images?.[0],
    sku: product.sku || product.name,
    ...(product.brand?.name ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    // Omitted entirely (not set to 0/false) when there's no real price to
    // report — most of the catalogue is "Contact for price" by design, and
    // a fabricated Offer would be worse than none.
    ...(hasPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "NPR",
            price: product.price,
            availability:
              product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/products/${product.slug}`,
          },
        }
      : {}),
  };
}

export function dealerLocalBusinessSchema(dealer: Dealer) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: dealer.name,
    telephone: dealer.phone,
    url: `${SITE_URL}/dealers/${dealer.slug}`,
    ...(dealer.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: dealer.address,
            addressLocality: dealer.city?.name,
            addressRegion: dealer.province,
            addressCountry: "NP",
          },
        }
      : {}),
  };
}

export function articleSchema(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    author: { "@type": "Organization", name: "Smart Surgident" },
    publisher: { "@type": "Organization", name: "Smart Surgident" },
    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
