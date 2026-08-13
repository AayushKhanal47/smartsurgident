import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategoryAdmin } from "../../api/endpoints";
import type { Category } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getCategories().then(setCategories).catch(() => setCategories([]));
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    await deleteCategoryAdmin(id);
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createCategory(form);
      setForm({ name: "", slug: "", description: "" });
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Categories</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing categories ({categories.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100">
            {categories.map((c) => (
              <div key={c._id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-brand-navy">{c.name}</p>
                  <p className="text-xs text-brand-muted">/{c.slug}</p>
                </div>
                <button onClick={() => handleDelete(c._id)} className="text-xs text-red-500 font-medium">
                  Delete
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="p-4 text-sm text-brand-muted">No categories yet.</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Add category</p>
          <input required placeholder="Name" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Slug" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea placeholder="Description (optional)" rows={2} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add category"}</Button>
        </form>
      </div>
    </div>
  );
}
