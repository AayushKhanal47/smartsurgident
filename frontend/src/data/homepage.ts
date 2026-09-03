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

export type BannerSource =
  | { type: "product"; slug: string }
  | { type: "resource"; slug: string };

export interface PromoBanner {
  id: string;
  source: BannerSource;
  eyebrow: string;
  headline: string;
  body: string;
  primaryCta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  imageSide: "left" | "right";
}

// --- HERO -----------------------------------------------------------------
// The hero image is a project asset (src/assets/hero.jpg — a dental treatment
// unit). `featuredProductSlug` is reserved for a future product overlay.
export const hero = {
  eyebrow: "Dental & Surgical Equipment · Nepal",
  headline: "Dental technology,",
  headlineAccent: "delivered and supported",
  headlineTail: "across Nepal",
  body:
    "Genuine dental units, sterilization, imaging and instruments for clinics nationwide — with expert product guidance and a dealer network near you.",
  primaryCta: { label: "Browse the catalogue", to: "/products" },
  secondaryCta: { label: "Talk to an expert", to: "/support/quote" },
  featuredProductSlug: "" as string,
};

// Cities with an established Smart Surgident presence (City records exist in DB).
export const servingCities = ["Kathmandu", "Pokhara", "Chitwan", "Butwal", "Biratnagar"];

// --- TRUST BAR (verified capabilities, not invented counts) --------------
export const trustBar = ["Nationwide delivery", "Genuine products", "Expert support", "Dealer network"];

// --- EXPLORE THE RANGE (fallback when the Category collection is empty) ---
export const exploreLinks: { label: string; hint: string; to: string; image: string }[] = [
  {
    label: "Dental units & equipment",
    hint: "Treatment units, compressors, delivery systems",
    to: "/products",
    image: categoryDentalUnits,
  },
  {
    label: "Instruments & handpieces",
    hint: "Hand instruments, rotary, endodontics",
    to: "/products",
    image: categoryInstruments,
  },
  {
    label: "Sterilization & consumables",
    hint: "Autoclaves, infection control, chairside materials",
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
    eyebrow: "Diagnostic imaging",
    headline: "Precision intraoral imaging, built for everyday clinical use",
    body:
      "A digital sensor engineered for clear captures and a fast, low-friction workflow — so diagnosis is quicker and your team is confident from day one.",
    primaryCta: { label: "View catalogue", to: "/resources/bonsensor" },
    secondaryCta: { label: "Request a quote", to: "/support/quote" },
    imageSide: "right",
  },
  {
    id: "endodontics",
    source: { type: "resource", slug: "actor-i-pro" },
    eyebrow: "Endodontics",
    headline: "Ultrasonic activation for cleaner canal preparation",
    body:
      "Cordless ultrasonic irrigation and activation with multiple working modes and interchangeable tips for a range of root-canal requirements.",
    primaryCta: { label: "View catalogue", to: "/resources/actor-i-pro" },
    secondaryCta: { label: "Request a quote", to: "/support/quote" },
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
  eyebrow: "In focus",
  fallbackHeadline: "Engineered for the modern operatory",
};

// --- WHY SMART SURGIDENT (verified — no unsupported claims) --------------
export const whyPoints: { title: string; body: string }[] = [
  { title: "Genuine products", body: "Supplied through proper channels, not grey imports." },
  { title: "Trusted brands", body: "Equipment from established dental manufacturers." },
  { title: "Expert guidance", body: "Help choosing the right equipment for your practice." },
  { title: "Nationwide reach", body: "Distribution and dealer presence across Nepal." },
  { title: "Installation & support", body: "Setup assistance and after-sales service." },
];
