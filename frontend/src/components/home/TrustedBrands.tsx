import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../../api/endpoints";
import type { Brand } from "../../api/endpoints";

export default function TrustedBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  if (brands.length === 0) return null;

  // Duplicate the list so the CSS marquee can loop seamlessly
  const loopBrands = [...brands, ...brands];

  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-10">
        <span className="text-[#17699A] text-xs font-bold uppercase tracking-wider">
          From The Brands
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0D2947] mt-2">
          Trusted by dental professionals
        </h2>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="brand-marquee flex gap-4 w-max">
          {loopBrands.map((brand, i) => (
            <Link
              key={`${brand._id}-${i}`}
              to={`/brands/${brand.slug}`}
              className="flex items-center gap-3 bg-white border border-[#DCE6EF] rounded-xl px-5 py-3 hover:border-[#17699A] transition-colors shrink-0"
            >
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt={brand.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#E8F1FA] flex items-center justify-center text-[#17699A] text-xs font-bold">
                  {brand.name[0]}
                </div>
              )}
              <span className="text-sm font-medium text-[#0D2947] whitespace-nowrap">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
