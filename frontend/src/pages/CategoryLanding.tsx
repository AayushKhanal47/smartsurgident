import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryBySlug, getProducts } from "../api/endpoints";
import type { Category, Product } from "../api/endpoints";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/ui/Reveal";
import PagePlaceholder from "../components/PagePlaceholder";
import { usePageMeta } from "../hooks/usePageMeta";

export default function CategoryLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);

  usePageMeta(
    category ? category.name : "",
    category?.description || (category ? `${category.name} dental and surgical equipment, distributed across Nepal by Smart Surgident.` : undefined)
  );

  useEffect(() => {
    if (!slug) return;
    setLoaded(false);
    setNotFound(false);
    getCategoryBySlug(slug)
      .then((c) => {
        setCategory(c);
        getProducts({ category: c.name }).then(setProducts).catch(() => setProducts([]));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoaded(true));
  }, [slug]);

  if (notFound) {
    return (
      <PagePlaceholder
        title="Category not found"
        description="This category doesn't exist or is no longer active."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: "Category" }]}
        note="Check the Categories list in the admin panel for the correct link, or browse all products instead."
      />
    );
  }

  if (!loaded || !category) {
    return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: category.name }]}
      />

      <Reveal className="px-6 md:px-10 py-12">
        {category.image && (
          <div className="h-48 md:h-64 bg-brand-tint rounded-3xl overflow-hidden mb-8">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">{category.name}</h1>
        {category.description && <p className="text-brand-slate text-sm mb-8 max-w-2xl">{category.description}</p>}

        {products.length === 0 ? (
          <p className="text-sm text-brand-muted">No products listed in this category yet.</p>
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
