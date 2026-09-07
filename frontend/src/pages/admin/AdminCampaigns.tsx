import { useEffect, useMemo, useState } from "react";
import {
  getAllCampaignsAdmin,
  createCampaignAdmin,
  updateCampaignAdmin,
  deleteCampaignAdmin,
  getProducts,
} from "../../api/endpoints";
import type { Product } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { PageHeader, Card, Field, Textarea, Select, Toggle, Badge, EmptyState, DangerButton } from "./ui";
import ImageUploader from "./ImageUploader";

interface CampaignRow {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  products: Product[];
  placement: "homepage" | "category" | "standalone";
  isActive: boolean;
}

const empty = {
  title: "",
  slug: "",
  description: "",
  placement: "standalone" as CampaignRow["placement"],
  isActive: true,
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [form, setForm] = useState(empty);
  const [bannerImage, setBannerImage] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    getAllCampaignsAdmin().then((c) => setCampaigns(c as CampaignRow[])).catch(() => setCampaigns([]));
  useEffect(() => {
    load();
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const visibleProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, productSearch]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  };

  const reset = () => {
    setForm(empty);
    setBannerImage("");
    setSelectedProductIds([]);
    setEditingId(null);
    setError("");
  };

  const startEdit = (c: CampaignRow) => {
    setEditingId(c._id);
    setForm({
      title: c.title, slug: c.slug, description: c.description ?? "",
      placement: c.placement, isActive: c.isActive,
    });
    setBannerImage(c.bannerImage ?? "");
    setSelectedProductIds(c.products.map((p) => p._id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    await deleteCampaignAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form, bannerImage: bannerImage || undefined, products: selectedProductIds };
      if (editingId) await updateCampaignAdmin(editingId, payload);
      else await createCampaignAdmin(payload);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Campaigns" subtitle={`${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"}`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {campaigns.map((c) => (
            <div key={c._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{c.title}</p>
                <p className="text-xs text-brand-muted">
                  /{c.slug} · {c.placement} · {c.products.length} product{c.products.length === 1 ? "" : "s"}
                </p>
              </div>
              <Badge tone={c.isActive ? "green" : "slate"}>{c.isActive ? "Active" : "Inactive"}</Badge>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(c)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(c._id)} />
              </div>
            </div>
          ))}
          {campaigns.length === 0 && <EmptyState>No campaigns yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit campaign" : "Add campaign"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Field label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Select
              label="Placement"
              value={form.placement}
              onChange={(e) => setForm({ ...form, placement: e.target.value as CampaignRow["placement"] })}
            >
              <option value="standalone">Standalone</option>
              <option value="homepage">Homepage</option>
              <option value="category">Category</option>
            </Select>
            <Toggle label="Active" checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
            <ImageUploader value={bannerImage} onChange={setBannerImage} label="Banner image" />

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-brand-slate">
                Products ({selectedProductIds.length} selected)
              </span>
              <input
                placeholder="Search products"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="border border-brand-border rounded-lg px-3 py-2 text-sm"
              />
              <div className="border border-brand-border rounded-lg max-h-48 overflow-y-auto divide-y divide-brand-border">
                {visibleProducts.map((p) => (
                  <label key={p._id} className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-brand-bg">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(p._id)}
                      onChange={() => toggleProduct(p._id)}
                    />
                    <span className="truncate">{p.name}</span>
                  </label>
                ))}
                {visibleProducts.length === 0 && (
                  <p className="px-3 py-2 text-sm text-brand-muted">No products match.</p>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add campaign"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
