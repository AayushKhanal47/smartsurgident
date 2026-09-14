// Generates dist/sitemap.xml from the live catalogue after the Vite build,
// replacing the static copy Vite already copied from public/sitemap.xml.
// A static file can't know live product/brand/dealer/category/resource
// slugs (see the comment it used to ship with) — this fetches them from the
// public API at build/deploy time instead. Runs as a post-build step in
// package.json's `build` script (SEO audit, P0).
//
// Deliberately non-fatal per endpoint: if the API is briefly unreachable
// during a build, we still want to ship a sitemap with the static routes
// and whatever dynamic data did come back, not abort the whole deploy.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://www.smartsurgident.com";
const API_URL = process.env.SITEMAP_API_URL || "https://api.smartsurgident.com/api";
const DIST_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");

const STATIC_ROUTES = [
  { loc: "/", priority: "1.0" },
  { loc: "/products", priority: "0.9" },
  { loc: "/brands", priority: "0.7" },
  { loc: "/dealers", priority: "0.7" },
  { loc: "/resources", priority: "0.6" },
  { loc: "/company/about", priority: "0.5" },
  { loc: "/company/facilities", priority: "0.4" },
  { loc: "/company/news", priority: "0.4" },
  { loc: "/company/events", priority: "0.4" },
  { loc: "/company/careers", priority: "0.4" },
  { loc: "/support/contact", priority: "0.5" },
  { loc: "/support/faq", priority: "0.3" },
  { loc: "/support/warranty", priority: "0.3" },
  { loc: "/support/quote", priority: "0.6" },
];

async function fetchSlugs(endpoint, label) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("expected an array");
    return data.map((item) => item.slug).filter(Boolean);
  } catch (err) {
    console.warn(`[sitemap] Skipping ${label} — ${err.message}`);
    return [];
  }
}

function urlEntry(loc, priority) {
  // encodeURI (not encodeURIComponent) so "/" stays a path separator — only
  // characters invalid in a URL (e.g. literal spaces in a few known-bad
  // product slugs, see progress.md) get escaped, then XML-escape the '&'
  // that produces.
  const escaped = encodeURI(loc).replace(/&/g, "&amp;");
  return `  <url><loc>${SITE_URL}${escaped}</loc><priority>${priority}</priority></url>`;
}

async function main() {
  const [products, brands, categories, dealers, resources] = await Promise.all([
    fetchSlugs("/products", "products"),
    fetchSlugs("/brands", "brands"),
    fetchSlugs("/categories", "categories"),
    fetchSlugs("/dealers/public", "dealers"),
    fetchSlugs("/resources", "resources"),
  ]);

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(r.loc, r.priority)),
    ...categories.map((slug) => urlEntry(`/categories/${slug}`, "0.8")),
    ...products.map((slug) => urlEntry(`/products/${slug}`, "0.7")),
    ...brands.map((slug) => urlEntry(`/brands/${slug}`, "0.6")),
    ...dealers.map((slug) => urlEntry(`/dealers/${slug}`, "0.6")),
    ...resources.map((slug) => urlEntry(`/resources/${slug}`, "0.5")),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  await mkdir(DIST_DIR, { recursive: true });
  await writeFile(path.join(DIST_DIR, "sitemap.xml"), xml, "utf-8");
  console.log(
    `[sitemap] Wrote ${entries.length} URLs (${products.length} products, ${brands.length} brands, ${categories.length} categories, ${dealers.length} dealers, ${resources.length} resources).`
  );
}

main();
