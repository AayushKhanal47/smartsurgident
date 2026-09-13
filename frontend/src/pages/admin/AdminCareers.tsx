import { useEffect, useState } from "react";
import {
  getAllJobOpeningsAdmin,
  createJobOpeningAdmin,
  updateJobOpeningAdmin,
  deleteJobOpeningAdmin,
} from "../../api/endpoints";
import type { JobOpening } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { PageHeader, Card, Field, Textarea, Toggle, Badge, EmptyState, DangerButton } from "./ui";

const empty = { title: "", location: "", employmentType: "", body: "", isActive: true };

export default function AdminCareers() {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllJobOpeningsAdmin().then(setOpenings).catch(() => setOpenings([]));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
    setError("");
  };

  const startEdit = (job: JobOpening) => {
    setEditingId(job._id);
    setForm({
      title: job.title,
      location: job.location ?? "",
      employmentType: job.employmentType ?? "",
      body: job.body,
      isActive: job.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job opening? This cannot be undone.")) return;
    await deleteJobOpeningAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) await updateJobOpeningAdmin(editingId, form);
      else await createJobOpeningAdmin(form);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save job opening");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Careers" subtitle={`${openings.length} opening${openings.length === 1 ? "" : "s"}`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {openings.map((job) => (
            <div key={job._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{job.title}</p>
                <p className="text-xs text-brand-muted">
                  {[job.location, job.employmentType].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              {!job.isActive && <Badge tone="amber">Inactive</Badge>}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(job)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(job._id)} />
              </div>
            </div>
          ))}
          {openings.length === 0 && <EmptyState>No job openings yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit opening" : "Add opening"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Location" hint="optional" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Field label="Type" hint="e.g. Full-time" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} />
            </div>
            <Textarea label="Description" rows={5} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Toggle label="Active" checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add opening"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
