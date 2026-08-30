import { useEffect, useState } from "react";
import { getAllResourcesAdmin, createResourceAdmin, deleteResourceAdmin } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import PdfUploader from "./PdfUploader";

const emptyForm = {
  title: "",
  summary: "",
  fileUrl: "",
  isPublished: true,
};

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllResourcesAdmin().then(setResources).catch(() => setResources([]));
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    await deleteResourceAdmin(id);
    load();
  };

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
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Catalog PDFs</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing catalogs ({resources.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100 overflow-hidden">
            {resources.map((r) => (
              <div key={r._id} className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-navy">{r.title}</p>
                  <p className="text-xs text-brand-muted line-clamp-2">{r.summary}</p>
                  <p className="text-xs text-brand-blue mt-1">
                    {r.isPublished ? "Published" : "Draft"} · {r.fileUrl ? "PDF ready" : "PDF missing"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {r.fileUrl && (
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-blue font-medium"
                    >
                      Open PDF
                    </a>
                  )}
                  <button onClick={() => handleDelete(r._id)} className="text-xs text-red-500 font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {resources.length === 0 && <p className="p-4 text-sm text-brand-muted">No catalog PDFs yet.</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Upload catalog PDF</p>
          <PdfUploader
            value={form.fileUrl}
            onChange={(fileUrl) => setForm((current) => ({ ...current, fileUrl }))}
            label="Catalog PDF"
          />
          <input
            required
            placeholder="Title"
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            required
            placeholder="Short description"
            rows={3}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Save catalog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
