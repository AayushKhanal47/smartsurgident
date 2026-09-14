import { useEffect, useState } from "react";
import {
  getAllGuidesAdmin,
  createGuideAdmin,
  updateGuideAdmin,
  deleteGuideAdmin,
} from "../../api/endpoints";
import type { Guide } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { PageHeader, Card, Field, Textarea, Toggle, Badge, EmptyState, DangerButton } from "./ui";

const todayISO = () => new Date().toISOString().slice(0, 10);
const empty = { title: "", excerpt: "", body: "", relatedCategorySlug: "", publishedAt: todayISO(), isPublished: false };

export default function AdminGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllGuidesAdmin().then(setGuides).catch(() => setGuides([]));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
    setError("");
  };

  const startEdit = (g: Guide) => {
    setEditingId(g._id);
    setForm({
      title: g.title,
      excerpt: g.excerpt,
      body: g.body,
      relatedCategorySlug: g.relatedCategorySlug || "",
      publishedAt: g.publishedAt.slice(0, 10),
      isPublished: g.isPublished,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this guide? This cannot be undone.")) return;
    await deleteGuideAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) await updateGuideAdmin(editingId, form);
      else await createGuideAdmin(form);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save guide");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Guides" subtitle={`${guides.length} guide${guides.length === 1 ? "" : "s"}`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {guides.map((g) => (
            <div key={g._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{g.title}</p>
                <p className="text-xs text-brand-muted">
                  {new Date(g.publishedAt).toLocaleDateString()}
                  {g.relatedCategorySlug ? ` · ${g.relatedCategorySlug}` : ""}
                </p>
              </div>
              {!g.isPublished && <Badge tone="amber">Draft</Badge>}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(g)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(g._id)} />
              </div>
            </div>
          ))}
          {guides.length === 0 && <EmptyState>No guides yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit guide" : "Add guide"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea label="Excerpt (used as the meta description)" rows={2} required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            <Textarea label="Body" rows={10} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Field
              label="Related category slug (optional)"
              placeholder="e.g. endodontics"
              value={form.relatedCategorySlug}
              onChange={(e) => setForm({ ...form, relatedCategorySlug: e.target.value })}
            />
            <Field label="Published date" type="date" required value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
            <Toggle label="Published" checked={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add guide"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
