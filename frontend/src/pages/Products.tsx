import { useEffect, useState } from "react";
import { getProducts, getBrands } from "../api/endpoints";
import type { Product, Brand } from "../api/endpoints";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  useEffect(() => {
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    const params: { search?: string; brand?: string } = {};
    if (search) params.search = search;
    if (brandFilter) params.brand = brandFilter;
    getProducts(params).then(setProducts).catch(() => setProducts([]));
  }, [search, brandFilter]);

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Catalog</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search instruments, brands, categories"
          className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm border border-slate-200"
        />
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-white rounded-xl px-4 py-2.5 text-sm border border-slate-200"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
