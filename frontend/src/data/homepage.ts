// ---------------------------------------------------------------------------
// Homepage content — EDIT THIS FILE to change the homepage without touching
// components. Promo banners resolve their image / name / brand / price from
// live catalogue data by `slug`; if a slug does not resolve, that banner does
// not render (graceful empty state). Never state a price, spec, stat or claim
// that isn't backed by real data.
// ---------------------------------------------------------------------------

import categoryDentalUnits from "../assets/categories/category-dental-units.jpg";
import categoryInstruments from "../assets/categories/category-instruments.jpg";
import categorySterilization from "../assets/categories/category-sterilization.jpg";
import type { TranslationKey } from "../i18n/translations";

export type BannerSource =
  | { type: "product"; slug: string }
  | { type: "resource"; slug: string };

export interface PromoBanner {
  id: string;
  source: BannerSource;
  eyebrowKey: TranslationKey;
  headlineKey: TranslationKey;
  bodyKey: TranslationKey;
  primaryCta: { labelKey: TranslationKey; to: string };
  secondaryCta?: { labelKey: TranslationKey; to: string };
  imageSide: "left" | "right";
}

// --- HERO -----------------------------------------------------------------
// The hero image is a project asset (src/assets/hero.jpg — a dental treatment
// unit). `featuredProductSlug` is reserved for a future product overlay.
// Copy itself lives in i18n/translations.ts (hero.* keys) so it can be
// shown in English or Nepali — only the routes stay here.
export const hero = {
  primaryCta: { to: "/products" },
  secondaryCta: { to: "/support/quote" },
  featuredProductSlug: "" as string,
};

// Cities with an established Smart Surgident presence (City records exist in DB).
export const servingCities = ["Kathmandu", "Pokhara", "Chitwan", "Butwal", "Biratnagar"];

// --- EXPLORE THE RANGE (fallback when the Category collection is empty) ---
// label/hint are i18n/translations.ts keys, not literal copy, so this
// fallback follows the EN/NP toggle like the rest of the homepage.
export const exploreLinks: { labelKey: TranslationKey; hintKey: TranslationKey; to: string; image: string }[] = [
  {
    labelKey: "explore.dentalUnits.label",
    hintKey: "explore.dentalUnits.hint",
    to: "/products",
    image: categoryDentalUnits,
  },
  {
    labelKey: "explore.instruments.label",
    hintKey: "explore.instruments.hint",
    to: "/products",
    image: categoryInstruments,
  },
  {
    labelKey: "explore.sterilization.label",
    hintKey: "explore.sterilization.hint",
    to: "/products",
    image: categorySterilization,
  },
];

// --- PRODUCT SHOWCASES ---------------------------------------------------
// Only items with a real product image / catalogue page. `aries` (steam
// sterilizer) is omitted here — its catalogue page 1 has no product photo.
export const promoBanners: PromoBanner[] = [
  {
    id: "imaging",
    source: { type: "resource", slug: "bonsensor" },
    eyebrowKey: "promo.imaging.eyebrow",
    headlineKey: "promo.imaging.headline",
    bodyKey: "promo.imaging.body",
    primaryCta: { labelKey: "promo.viewCatalogue", to: "/resources/bonsensor" },
    secondaryCta: { labelKey: "support.quote", to: "/support/quote" },
    imageSide: "right",
  },
  {
    id: "endodontics",
    source: { type: "resource", slug: "actor-i-pro" },
    eyebrowKey: "promo.endodontics.eyebrow",
    headlineKey: "promo.endodontics.headline",
    bodyKey: "promo.endodontics.body",
    primaryCta: { labelKey: "promo.viewCatalogue", to: "/resources/actor-i-pro" },
    secondaryCta: { labelKey: "support.quote", to: "/support/quote" },
    imageSide: "left",
  },
];

// --- PRODUCT SPOTLIGHT --------------------------------------------------
// A single hero product shown large with a thumbnail strip of ALL its
// images (Product.images[]). Set `productSlug` to a real product slug once
// that product has multiple photos uploaded in the admin panel. Empty =
// the section renders nothing.
export const spotlight = {
  productSlug: "" as string,
  eyebrowKey: "spotlight.eyebrow" as TranslationKey,
  fallbackHeadlineKey: "spotlight.fallbackHeadline" as TranslationKey,
};

// --- WHY SMART SURGIDENT (verified — no unsupported claims) --------------
export const whyPoints: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "why.genuine.title", bodyKey: "why.genuine.body" },
  { titleKey: "why.brands.title", bodyKey: "why.brands.body" },
  { titleKey: "why.guidance.title", bodyKey: "why.guidance.body" },
  { titleKey: "why.reach.title", bodyKey: "why.reach.body" },
  { titleKey: "why.install.title", bodyKey: "why.install.body" },
];
