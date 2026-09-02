import { useEffect, useState } from "react";
import { getBrands, createBrandAdmin, updateBrandAdmin, deleteBrandAdmin } from "../../api/endpoints";
import type { Brand } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";
import { PageHeader, Card, Field, Textarea, EmptyState, DangerButton } from "./ui";

const empty = { name: "", slug: "", description: "" };

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(empty);
  const [logoUrl, setLogoUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getBrands().then(setBrands).catch(() => setBrands([]));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(empty);
    setLogoUrl("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (b: Brand) => {
    setEditingId(b._id);
    setForm({ name: b.name, slug: b.slug, description: (b as unknown as { description?: string }).description ?? "" });
    setLogoUrl(b.logoUrl ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand? This cannot be undone.")) return;
    await deleteBrandAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = { ...form, logoUrl };
      if (editingId) await updateBrandAdmin(editingId, data);
      else await createBrandAdmin(data);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save brand");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Brands" subtitle={`${brands.length} brand${brands.length === 1 ? "" : "s"}`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {brands.map((b) => (
            <div key={b._id} className="p-4 flex items-center gap-4">
              {b.logoUrl ? (
                <img src={b.logoUrl} alt="" className="w-11 h-11 rounded-lg object-contain bg-white border border-brand-border shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-brand-sunk shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{b.name}</p>
                <p className="text-xs text-brand-muted">/{b.slug}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(b)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(b._id)} />
              </div>
            </div>
          ))}
          {brands.length === 0 && <EmptyState>No brands yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit brand" : "Add brand"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <ImageUploader value={logoUrl} onChange={setLogoUrl} label="Brand logo" />
            <Field label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Field label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add brand"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
