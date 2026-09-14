import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getBrands } from "../api/endpoints";
import type { Product, Brand } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import { usePageMeta } from "../hooks/usePageMeta";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function Products() {
  usePageMeta(
    "Products",
    "Browse genuine dental units, instruments, sterilization equipment and consumables distributed by Smart Surgident across Nepal."
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const urlBrand = searchParams.get("brand") ?? "";

  // Local input state so typing feels instant; the debounced value below is
  // what actually drives the API call and the URL (so a navbar search like
  // /products?search=hongke — previously silently ignored here — now
  // actually filters the list, and a mid-typing URL isn't spammed into
  // browser history).
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [brandFilter, setBrandFilter] = useState(urlBrand);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const requestIdRef = useRef(0);

  useEffect(() => {
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  // React Router doesn't remount this component for a search-params-only
  // navigation, so searching again from the navbar while already on
  // /products previously left this page's box and results frozen on the
  // old query. Comparing against the *debounced* value (not raw input)
  // means this never fights active typing — it only fires once a change
  // wasn't something we just wrote ourselves below.
  useEffect(() => {
    if (urlSearch !== debouncedSearch) setSearchInput(urlSearch);
    if (urlBrand !== brandFilter) setBrandFilter(urlBrand);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlBrand]);

  // Keep the URL in sync (shareable/bookmarkable, and survives back/forward)
  // without adding a history entry per keystroke.
  useEffect(() => {
    if (debouncedSearch === urlSearch && brandFilter === urlBrand) return;
    const next = new URLSearchParams();
    if (debouncedSearch) next.set("search", debouncedSearch);
    if (brandFilter) next.set("brand", brandFilter);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, brandFilter]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setLoaded(false);
    const params: { search?: string; brand?: string } = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (brandFilter) params.brand = brandFilter;
    getProducts(params)
      .then((data) => {
        // A slower earlier request finishing after a newer one would
        // otherwise flash stale results back onto the screen.
        if (requestId === requestIdRef.current) setProducts(data);
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setProducts([]);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoaded(true);
      });
  }, [debouncedSearch, brandFilter]);

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Catalog</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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

      {loaded && products.length === 0 ? (
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
