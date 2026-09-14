import { lazy, Suspense } from "react";
import ProductHeroBanner from "../components/home/ProductHeroBanner";
import TrustStrip from "../components/home/TrustStrip";
import CategoryShowcase from "../components/home/CategoryShowcase";
import ProductPromoBanner from "../components/home/ProductPromoBanner";
import ProductSpotlight from "../components/home/ProductSpotlight";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhySmartSurgident from "../components/home/WhySmartSurgident";
import TrustedBrands from "../components/home/TrustedBrands";
import FeaturedImports from "../components/home/FeaturedImports";
import ELibraryResources from "../components/home/ELibraryResources";
import FinalCTA from "../components/home/FinalCTA";
import { promoBanners } from "../data/homepage";
import { usePageMeta } from "../hooks/usePageMeta";
import { useStructuredData } from "../hooks/useStructuredData";
import { websiteSchema } from "../utils/structuredData";

// nepali-geo-pro-max (the map library this section uses) is a 6MB
// dependency used nowhere else in the app — split into its own chunk so
// every other route (product pages, admin, checkout) stops paying for it
// in the shared bundle (perf audit, P1). It's the 10th of 12 homepage
// sections, well below the fold, so a brief Suspense fallback here has no
// effect on LCP.
const NepalDealerNetwork = lazy(() => import("../components/home/NepalDealerNetwork"));

// Light, editorial flow. Data-driven sections (CategoryShowcase,
// ProductPromoBanner, FeaturedProducts, TrustedBrands, ELibraryResources)
// render nothing / degrade gracefully when their catalogue data is absent.
// The only full-width dark sections are the final CTA and the footer.
export default function Home() {
  usePageMeta(
    "Dental Equipment & Supplies in Nepal | Smart Surgident",
    "Smart Surgident supplies dental chairs, imaging equipment, handpieces and instruments to clinics across Nepal — Hongke, Bondent, TEALTH and 17 other brands, with dealers in Kathmandu, Pokhara and Chitwan."
  );
  useStructuredData("ld-website", websiteSchema());

  return (
    <div>
      <ProductHeroBanner />
      <TrustStrip />
      <TrustedBrands />
      <CategoryShowcase />
      {promoBanners[0] && <ProductPromoBanner banner={promoBanners[0]} />}
      <ProductSpotlight />
      <FeaturedProducts />
      {promoBanners[1] && <ProductPromoBanner banner={promoBanners[1]} tinted />}
      <WhySmartSurgident />
      <FeaturedImports />
      <Suspense fallback={null}>
        <NepalDealerNetwork />
      </Suspense>
      <ELibraryResources />
      <FinalCTA />
    </div>
  );
}
