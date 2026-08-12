import { useEffect, useState } from "react";
import { getProducts, getBrands, createProductAdmin } from "../../api/endpoints";
import type { Product, Brand } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";

const emptyForm = {
  name: "",
  slug: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  clinicPrice: "",
  stock: "",
  sku: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getProducts().then(setProducts).catch(() => setProducts([]));
    getBrands().then(setBrands).catch(() => setBrands([]));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createProductAdmin({
        ...form,
        price: Number(form.price),
        clinicPrice: Number(form.clinicPrice),
        stock: Number(form.stock),
        images: imageUrl ? [imageUrl] : [],
      });
      setForm(emptyForm);
      setImageUrl("");
      load();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Products</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing products ({products.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {products.map((p) => (
              <div key={p._id} className="p-4 flex items-center gap-3">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-brand-tint shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-navy">{p.name}</p>
                  <p className="text-xs text-brand-muted">{p.brand?.name} · Stock: {p.stock}</p>
                </div>
                <p className="text-sm text-brand-blue font-medium">Rs {p.price}</p>
              </div>
            ))}
            {products.length === 0 && <p className="p-4 text-sm text-brand-muted">No products yet.</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Add product</p>
          <ImageUploader value={imageUrl} onChange={setImageUrl} label="Product photo" />
          <input required placeholder="Name" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Slug (e.g. extraction-forceps-set)" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select required className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}>
            <option value="">Select brand</option>
            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <input required placeholder="Category (e.g. Hand instruments)" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <textarea required placeholder="Description" rows={2} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <input required type="number" placeholder="Price" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input required type="number" placeholder="Clinic price" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              value={form.clinicPrice} onChange={(e) => setForm({ ...form, clinicPrice: e.target.value })} />
            <input required type="number" placeholder="Stock" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <input required placeholder="SKU (unique)" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add product"}</Button>
        </form>
      </div>
    </div>
  );
}
