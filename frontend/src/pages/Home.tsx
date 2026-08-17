import Hero from "../components/home/Hero";
import SolutionAreas from "../components/home/SolutionAreas";
import ClinicShowcase from "../components/home/ClinicShowcase";
import BestSellers from "../components/home/BestSellers";
import WhySmartSurgident from "../components/home/WhySmartSurgident";
import TrustedBrands from "../components/home/TrustedBrands";
import NepalDealerNetwork from "../components/home/NepalDealerNetwork";
import { ELibraryPreview, FinalCTA } from "../components/home/ELibraryAndCTA";

export default function Home() {
  return (
    <div>
      <Hero />
      <SolutionAreas />
      <ClinicShowcase />
      <BestSellers />
      <WhySmartSurgident />
      <TrustedBrands />
      <NepalDealerNetwork />
      <ELibraryPreview />
      <FinalCTA />
    </div>
  );
}
