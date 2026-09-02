import { useEffect, useState } from "react";
import {
  getProducts,
  getBrands,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../../api/endpoints";
import type { Product, Brand } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import MultiImageUploader from "./MultiImageUploader";
import { PageHeader, Card, Field, Textarea, Select, Toggle, Badge, EmptyState, DangerButton } from "./ui";

interface FormState {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  clinicPrice: string;
  stock: string;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

const empty: FormState = {
  name: "", slug: "", brand: "", category: "", description: "",
  price: "", clinicPrice: "", stock: "", sku: "",
  isFeatured: false, isNewArrival: false, isBestSeller: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState<FormState>(empty);
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getProducts().then(setProducts).catch(() => setProducts([]));
    getBrands().then(setBrands).catch(() => setBrands([]));
  };
  useEffect(() => { load(); }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const resetForm = () => {
    setForm(empty);
    setImages([]);
    setEditingId(null);
    setError("");
  };

  const startEdit = (p: Product) => {
    setEditingId(p._id);
    setForm({
      name: p.name, slug: p.slug,
      brand: p.brand?._id ?? "",
      category: p.category, description: p.description,
      price: String(p.price), clinicPrice: String(p.clinicPrice), stock: String(p.stock),
      sku: (p as unknown as { sku?: string }).sku ?? "",
      isFeatured: !!p.isFeatured, isNewArrival: !!p.isNewArrival, isBestSeller: !!p.isBestSeller,
    });
    setImages(p.images ?? []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await deleteProductAdmin(id);
    if (editingId === id) resetForm();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const payload = {
      ...form,
      price: Number(form.price),
      clinicPrice: Number(form.clinicPrice),
      stock: Number(form.stock),
      images,
    };
    try {
      if (editingId) await updateProductAdmin(editingId, payload);
      else await createProductAdmin(payload);
      resetForm();
      load();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Products" subtitle={`${products.length} in the catalogue`} />

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {products.map((p) => (
            <div key={p._id} className="p-4 flex items-center gap-4">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-brand-sunk shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{p.name}</p>
                <p className="text-xs text-brand-muted truncate">
                  {p.brand?.name} · Stock {p.stock} · {p.images?.length ?? 0} photo{(p.images?.length ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
              {p.stock === 0 && <Badge tone="amber">Out of stock</Badge>}
              <p className="text-sm font-semibold text-brand-navy shrink-0">Rs {p.price.toLocaleString()}</p>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(p)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">
                  Edit
                </button>
                <DangerButton onClick={() => handleDelete(p._id)} />
              </div>
            </div>
          ))}
          {products.length === 0 && <EmptyState>No products yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit product" : "Add product"}</p>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <MultiImageUploader value={images} onChange={setImages} label="Product photos" />
            <Field label="Name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
            <Field label="Slug" hint="lowercase-with-dashes, unique" required value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            <Select label="Brand" required value={form.brand} onChange={(e) => set("brand", e.target.value)}>
              <option value="">Select brand</option>
              {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </Select>
            <Field label="Category" hint="free text, e.g. Hand instruments" required value={form.category} onChange={(e) => set("category", e.target.value)} />
            <Textarea label="Description" rows={3} required value={form.description} onChange={(e) => set("description", e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <Field label="Price" type="number" min="0" required value={form.price} onChange={(e) => set("price", e.target.value)} />
              <Field label="Clinic price" type="number" min="0" required value={form.clinicPrice} onChange={(e) => set("clinicPrice", e.target.value)} />
              <Field label="Stock" type="number" min="0" required value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </div>
            <Field label="SKU" hint="unique" required value={form.sku} onChange={(e) => set("sku", e.target.value)} />
            <div className="flex flex-wrap gap-4 pt-1">
              <Toggle label="Featured" checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
              <Toggle label="New" checked={form.isNewArrival} onChange={(v) => set("isNewArrival", v)} />
              <Toggle label="Best seller" checked={form.isBestSeller} onChange={(v) => set("isBestSeller", v)} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add product"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
