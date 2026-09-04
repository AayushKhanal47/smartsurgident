import ProductHeroBanner from "../components/home/ProductHeroBanner";
import TrustStrip from "../components/home/TrustStrip";
import CategoryShowcase from "../components/home/CategoryShowcase";
import ProductPromoBanner from "../components/home/ProductPromoBanner";
import ProductSpotlight from "../components/home/ProductSpotlight";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhySmartSurgident from "../components/home/WhySmartSurgident";
import TrustedBrands from "../components/home/TrustedBrands";
import FeaturedImports from "../components/home/FeaturedImports";
import NepalDealerNetwork from "../components/home/NepalDealerNetwork";
import ELibraryResources from "../components/home/ELibraryResources";
import FinalCTA from "../components/home/FinalCTA";
import { promoBanners } from "../data/homepage";
import { usePageMeta } from "../hooks/usePageMeta";

// Light, editorial flow. Data-driven sections (CategoryShowcase,
// ProductPromoBanner, FeaturedProducts, TrustedBrands, ELibraryResources)
// render nothing / degrade gracefully when their catalogue data is absent.
// The only full-width dark sections are the final CTA and the footer.
export default function Home() {
  usePageMeta(
    "Smart Surgident | Dental & Surgical Instrument Distribution, Nepal",
    "Genuine dental and surgical equipment, imported and distributed across Nepal through a growing city-based dealer network."
  );

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
      <NepalDealerNetwork />
      <ELibraryResources />
      <FinalCTA />
    </div>
  );
}
