import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategoryAdmin, deleteCategoryAdmin } from "../../api/endpoints";
import type { Category } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";
import { PageHeader, Card, Field, Textarea, EmptyState, DangerButton } from "./ui";

const empty = { name: "", slug: "", description: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getCategories().then(setCategories).catch(() => setCategories([]));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(empty);
    setImage("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (c: Category) => {
    setEditingId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? "" });
    setImage(c.image ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    await deleteCategoryAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = { ...form, image };
      if (editingId) await updateCategoryAdmin(editingId, data);
      else await createCategory(data);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Categories" subtitle={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} · shown on the homepage`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {categories.map((c) => (
            <div key={c._id} className="p-4 flex items-center gap-4">
              {c.image ? (
                <img src={c.image} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-brand-sunk shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{c.name}</p>
                <p className="text-xs text-brand-muted">/{c.slug}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(c)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(c._id)} />
              </div>
            </div>
          ))}
          {categories.length === 0 && <EmptyState>No categories yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit category" : "Add category"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <ImageUploader value={image} onChange={setImage} label="Category image" />
            <Field label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Field label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add category"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
