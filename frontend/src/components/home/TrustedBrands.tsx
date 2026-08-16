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

  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-10">
        <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">
          From The Brands
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mt-2">
          Trusted by dental professionals
        </h2>
      </div>

      <div className="flex gap-4 px-6 md:px-10 max-w-[1400px] mx-auto flex-wrap">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            to={`/brands/${brand.slug}`}
            className="flex items-center gap-3 bg-white border border-brand-border rounded-xl px-5 py-3 hover:border-brand-blue transition-colors"
          >
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-tint flex items-center justify-center text-brand-blue text-xs font-bold">
                {brand.name[0]}
              </div>
            )}
            <span className="text-sm font-medium text-brand-navy">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
