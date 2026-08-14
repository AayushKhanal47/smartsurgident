import { useEffect, useState } from "react";
import { getAllCampaignsAdmin, createCampaignAdmin, deleteCampaignAdmin } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";

interface CampaignRow { _id: string; title: string; slug: string; placement: string; isActive: boolean }

const emptyForm = { title: "", slug: "", description: "", placement: "standalone" as const, isActive: true };

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllCampaignsAdmin().then((c) => setCampaigns(c as CampaignRow[])).catch(() => setCampaigns([]));
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    await deleteCampaignAdmin(id);
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createCampaignAdmin(form);
      setForm(emptyForm);
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Campaigns</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing campaigns ({campaigns.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100">
            {campaigns.map((c) => (
              <div key={c._id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-brand-navy">{c.title}</p>
                  <p className="text-xs text-brand-muted">{c.placement} · {c.isActive ? "Active" : "Inactive"}</p>
                </div>
                <button onClick={() => handleDelete(c._id)} className="text-xs text-red-500 font-medium">
                  Delete
                </button>
              </div>
            ))}
            {campaigns.length === 0 && <p className="p-4 text-sm text-brand-muted">No campaigns yet.</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Add campaign</p>
          <input required placeholder="Title" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required placeholder="Slug" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea placeholder="Description (optional)" rows={2} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as typeof form.placement })}>
            <option value="standalone">Standalone</option>
            <option value="homepage">Homepage</option>
            <option value="category">Category</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add campaign"}</Button>
        </form>
      </div>
    </div>
  );
}