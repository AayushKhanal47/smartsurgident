import { useEffect, useState } from "react";
import { getBrands, createBrandAdmin } from "../../api/endpoints";
import type { Brand } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getBrands().then(setBrands).catch(() => setBrands([]));
  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createBrandAdmin({ ...form, logoUrl });
      setForm({ name: "", slug: "", description: "" });
      setLogoUrl("");
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to create brand");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Brands</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing brands ({brands.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100">
            {brands.map((b) => (
              <div key={b._id} className="p-4 flex items-center gap-3">
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt={b.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-tint shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-brand-navy">{b.name}</p>
                  <p className="text-xs text-brand-muted">/{b.slug}</p>
                </div>
              </div>
            ))}
            {brands.length === 0 && <p className="p-4 text-sm text-brand-muted">No brands yet.</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Add brand</p>
          <ImageUploader value={logoUrl} onChange={setLogoUrl} label="Brand logo" />
          <input required placeholder="Name" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Slug" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea placeholder="Description (optional)" rows={2} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add brand"}</Button>
        </form>
      </div>
    </div>
  );
}
