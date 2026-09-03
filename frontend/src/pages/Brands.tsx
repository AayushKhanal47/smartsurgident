import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../api/endpoints";
import type { Brand } from "../api/endpoints";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import SectionHeader from "../components/ui/SectionHeader";
import Reveal from "../components/ui/Reveal";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Brands() {
  usePageMeta(
    "Brands We Carry",
    "The verified dental and surgical equipment brands Smart Surgident imports and distributes across Nepal."
  );

  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  const filtered = brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Brands" }]} />

      <div className="px-6 md:px-10 py-12">
        <SectionHeader
          eyebrow="Trusted manufacturers"
          title="Brands we carry"
          description="Every brand in our catalog is verified and imported directly or through authorized partners."
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands"
          className="bg-white rounded-xl px-4 py-2.5 text-sm border border-slate-200 mb-8 w-full max-w-sm"
        />

        {filtered.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No brands yet — add some from the admin panel to see them here.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((brand, i) => (
              <Reveal key={brand._id} delay={i * 0.05}>
                <Link
                  to={`/brands/${brand.slug}`}
                  className="bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow block"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-tint flex items-center justify-center overflow-hidden">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-brand-blue font-semibold">{brand.name[0]}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-brand-navy">{brand.name}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
