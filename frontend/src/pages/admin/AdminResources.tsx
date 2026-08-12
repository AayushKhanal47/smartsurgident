import { useEffect, useState } from "react";
import { getResources, createResourceAdmin } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";

const emptyForm = { title: "", slug: "", type: "article" as const, summary: "", body: "", isPublished: true };
const TYPES = ["article", "guide", "catalog", "video", "brochure", "manual"] as const;

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getResources().then(setResources).catch(() => setResources([]));
  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createResourceAdmin(form);
      setForm(emptyForm);
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to create resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">E-Library resources</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing resources ({resources.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100">
            {resources.map((r) => (
              <div key={r._id} className="p-4">
                <p className="text-sm font-medium text-brand-navy">{r.title}</p>
                <p className="text-xs text-brand-muted">{r.type}</p>
              </div>
            ))}
            {resources.length === 0 && <p className="p-4 text-sm text-brand-muted">No resources yet — note: newly created ones are unpublished by default unless "Published" is checked, and this list only shows published resources.</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Add resource</p>
          <input required placeholder="Title" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required placeholder="Slug" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea required placeholder="Summary" rows={2} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <textarea placeholder="Body (optional, for articles/guides)" rows={4} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add resource"}</Button>
        </form>
      </div>
    </div>
  );
}
