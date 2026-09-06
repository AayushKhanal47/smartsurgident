import { useEffect, useState } from "react";
import {
  getAllResourcesAdmin,
  createResourceAdmin,
  updateResourceAdmin,
  deleteResourceAdmin,
  getBrands,
} from "../../api/endpoints";
import type { Resource, Brand } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import PdfUploader from "./PdfUploader";
import ImageUploader from "./ImageUploader";
import { PageHeader, Card, Field, Textarea, Toggle, Badge, EmptyState, DangerButton } from "./ui";

const empty = { title: "", summary: "", fileUrl: "", coverImage: "", isPublished: true, showOnHomepage: false };

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(empty);
  const [linkedBrands, setLinkedBrands] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllResourcesAdmin().then(setResources).catch(() => setResources([]));
  useEffect(() => {
    load();
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  const toggleBrand = (id: string) =>
    setLinkedBrands((current) => (current.includes(id) ? current.filter((b) => b !== id) : [...current, id]));

  const reset = () => {
    setEditingId(null);
    setForm(empty);
    setLinkedBrands([]);
    setError("");
  };

  const startEdit = (r: Resource) => {
    setEditingId(r._id);
    setForm({
      title: r.title,
      summary: r.summary ?? "",
      fileUrl: r.fileUrl ?? "",
      coverImage: r.coverImage ?? "",
      isPublished: r.isPublished,
      showOnHomepage: r.showOnHomepage ?? false,
    });
    setLinkedBrands((r.linkedBrands ?? []).map((b) => b._id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this catalogue? This cannot be undone.")) return;
    await deleteResourceAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form, linkedBrands };
      if (editingId) await updateResourceAdmin(editingId, payload);
      else await createResourceAdmin(payload);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save catalogue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Catalogue PDFs" subtitle={`${resources.length} in the E-Library`} />

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {resources.map((r) => (
            <div key={r._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-brand-navy truncate">{r.title}</p>
                  <Badge tone={r.isPublished ? "green" : "slate"}>{r.isPublished ? "Published" : "Draft"}</Badge>
                  {r.showOnHomepage && <Badge tone="default">On homepage</Badge>}
                  {!r.fileUrl && <Badge tone="amber">No PDF</Badge>}
                </div>
                <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">{r.summary}</p>
                {r.linkedBrands && r.linkedBrands.length > 0 && (
                  <p className="text-[11px] text-brand-muted mt-1">
                    Brands: {r.linkedBrands.map((b) => b.name).join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {r.fileUrl && (
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-primary">
                    PDF
                  </a>
                )}
                <button onClick={() => startEdit(r)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(r._id)} />
              </div>
            </div>
          ))}
          {resources.length === 0 && <EmptyState>No catalogues yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit catalogue" : "Upload catalogue"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <PdfUploader value={form.fileUrl} onChange={(fileUrl) => setForm((c) => ({ ...c, fileUrl }))} label="Catalogue PDF" />
            <ImageUploader value={form.coverImage} onChange={(coverImage) => setForm((c) => ({ ...c, coverImage }))} label="Cover image (optional)" />
            <Field label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea label="Short description" rows={3} required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            <Toggle label="Published" checked={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} />
            <Toggle
              label="Show on homepage E-Library"
              checked={form.showOnHomepage}
              onChange={(v) => setForm({ ...form, showOnHomepage: v })}
            />
            {brands.length > 0 && (
              <div>
                <p className="text-xs font-medium text-brand-slate mb-1.5">
                  Linked brands <span className="text-brand-muted font-normal">(shown on that brand's page)</span>
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {brands.map((b) => (
                    <label key={b._id} className="inline-flex items-center gap-1.5 text-xs text-brand-navy">
                      <input type="checkbox" checked={linkedBrands.includes(b._id)} onChange={() => toggleBrand(b._id)} />
                      {b.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Save catalogue"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
