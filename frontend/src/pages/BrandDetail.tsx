import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBrands, getProducts } from "../api/endpoints";
import type { Brand, Product } from "../api/endpoints";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/ui/Reveal";

export default function BrandDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getBrands().then((brands) => {
      const found = brands.find((b) => b.slug === slug) || null;
      setBrand(found);
      if (found) {
        getProducts({ brand: found._id }).then(setProducts).catch(() => setProducts([]));
      }
    });
  }, [slug]);

  if (!brand) return <p className="px-10 py-16 text-sm text-brand-muted">Loading...</p>;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Brands", to: "/brands" }, { label: brand.name }]} />

      <Reveal className="px-6 md:px-10 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-tint flex items-center justify-center overflow-hidden shrink-0">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-brand-blue font-semibold text-xl">{brand.name[0]}</span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy">{brand.name}</h1>
        </div>

        <p className="font-semibold text-brand-navy mb-4">Products from {brand.name}</p>
        {products.length === 0 ? (
          <p className="text-sm text-brand-muted">No products listed for this brand yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
