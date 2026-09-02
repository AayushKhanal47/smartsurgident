import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import {
  getProducts,
  getBrands,
  getCategories,
  getCities,
  getDealersAdmin,
  getAllResourcesAdmin,
  getAllCampaignsAdmin,
  getQuoteRequestsAdmin,
} from "../../api/endpoints";
import type { Product, QuoteRequestRecord } from "../../api/endpoints";
import { PageHeader, Card, StatCard, Badge, EmptyState } from "./ui";

interface DealerRow { _id: string; city?: { _id?: string; name?: string } }

export default function AdminOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [counts, setCounts] = useState({ brands: 0, categories: 0, cities: 0, dealers: 0, resources: 0, campaigns: 0 });
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      getProducts(),
      getBrands(),
      getCategories(),
      getCities(),
      getDealersAdmin(),
      getAllResourcesAdmin(),
      getAllCampaignsAdmin(),
      getQuoteRequestsAdmin(),
    ]).then(([p, b, c, ci, d, r, ca, q]) => {
      if (p.status === "fulfilled") setProducts(p.value);
      if (d.status === "fulfilled") setDealers(d.value as DealerRow[]);
      if (q.status === "fulfilled") setQuotes(q.value);
      setCounts({
        brands: b.status === "fulfilled" ? b.value.length : 0,
        categories: c.status === "fulfilled" ? c.value.length : 0,
        cities: ci.status === "fulfilled" ? ci.value.length : 0,
        dealers: d.status === "fulfilled" ? (d.value as unknown[]).length : 0,
        resources: r.status === "fulfilled" ? r.value.length : 0,
        campaigns: ca.status === "fulfilled" ? (ca.value as unknown[]).length : 0,
      });
      setLoaded(true);
    });
  }, []);

  const newQuotes = quotes.filter((q) => q.status === "new");
  const outOfStock = products.filter((p) => p.stock === 0);
  const noImage = products.filter((p) => !p.images?.length);
  const coveredCityIds = new Set(dealers.map((d) => d.city?._id).filter(Boolean));
  const citiesWithoutDealer = counts.cities - coveredCityIds.size;

  const attention: { label: string; to: string; count: number }[] = [
    { label: "New quote requests to review", to: "/admin/quotes", count: newQuotes.length },
    { label: "Products out of stock", to: "/admin/products", count: outOfStock.length },
    { label: "Products with no photo", to: "/admin/products", count: noImage.length },
    { label: "Cities without an active dealer", to: "/admin/dealers", count: Math.max(0, citiesWithoutDealer) },
  ].filter((a) => a.count > 0);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A quick view of the catalogue and enquiries." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={loaded ? products.length : "–"} />
        <StatCard label="Brands" value={loaded ? counts.brands : "–"} />
        <StatCard label="Categories" value={loaded ? counts.categories : "–"} />
        <StatCard label="Catalogue PDFs" value={loaded ? counts.resources : "–"} />
        <StatCard label="Dealers" value={loaded ? counts.dealers : "–"} hint={`${counts.cities} cities`} />
        <StatCard label="Campaigns" value={loaded ? counts.campaigns : "–"} />
        <StatCard
          label="New quotes"
          value={loaded ? newQuotes.length : "–"}
          tone={newQuotes.length > 0 ? "accent" : "default"}
        />
        <StatCard label="Total quotes" value={loaded ? quotes.length : "–"} />
      </div>

      {attention.length > 0 && (
        <Card className="mt-8 p-2">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-[0.06em] text-brand-muted">
            Needs attention
          </p>
          <div className="divide-y divide-brand-border">
            {attention.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-bg rounded-xl transition-colors"
              >
                <span className="text-sm text-brand-navy">{a.label}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <Badge tone="amber">{a.count}</Badge>
                  <HiArrowRight className="text-brand-muted text-sm" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Card className="p-2">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-brand-muted">Recent quote requests</p>
            <Link to="/admin/quotes" className="text-xs font-semibold text-brand-primary">View all</Link>
          </div>
          {quotes.length === 0 ? (
            <EmptyState>No quote requests yet.</EmptyState>
          ) : (
            <div className="divide-y divide-brand-border">
              {quotes.slice(0, 5).map((q) => (
                <div key={q._id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-brand-navy truncate">{q.organizationName}</p>
                    <Badge tone={q.status === "new" ? "amber" : q.status === "closed" ? "slate" : "green"}>
                      {q.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5 truncate">{q.contactName} · {q.phone}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-2">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-[0.06em] text-brand-muted">Quick actions</p>
          <div className="divide-y divide-brand-border">
            {[
              { label: "Add a product", to: "/admin/products" },
              { label: "Add a brand", to: "/admin/brands" },
              { label: "Add a category", to: "/admin/categories" },
              { label: "Onboard a dealer", to: "/admin/dealers" },
              { label: "Upload a catalogue PDF", to: "/admin/resources" },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-bg rounded-xl transition-colors"
              >
                <span className="text-sm text-brand-navy">{a.label}</span>
                <HiArrowRight className="text-brand-muted text-sm" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
