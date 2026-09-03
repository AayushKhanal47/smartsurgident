import { useEffect, useState } from "react";
import {
  getCities,
  getDealersAdmin,
  createDealerAdmin,
  updateDealerAdmin,
  deleteDealerAdmin,
} from "../../api/endpoints";
import type { City } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";
import { PageHeader, Card, Field, Select, EmptyState, DangerButton } from "./ui";

interface DealerRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  province?: string;
  whatsapp?: string;
  website?: string;
  profilePhoto?: string;
  city?: { _id?: string; name?: string };
}

const empty = { name: "", city: "", phone: "", email: "", password: "", province: "", whatsapp: "", website: "" };

export default function AdminDealers() {
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState(empty);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getDealersAdmin().then((d) => setDealers(d as DealerRow[])).catch(() => setDealers([]));
    getCities().then(setCities).catch(() => setCities([]));
  };
  useEffect(() => { load(); }, []);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm(empty);
    setProfilePhoto("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (d: DealerRow) => {
    setEditingId(d._id);
    setForm({
      name: d.name, city: d.city?._id ?? "", phone: d.phone ?? "", email: d.email,
      password: "", province: d.province ?? "", whatsapp: d.whatsapp ?? "", website: d.website ?? "",
    });
    setProfilePhoto(d.profilePhoto ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this dealer? Their city will have no active dealer until a new one is added.")) return;
    await deleteDealerAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) {
        const { password, ...rest } = form;
        await updateDealerAdmin(editingId, { ...rest, profilePhoto, ...(password ? { password } : {}) });
      } else {
        await createDealerAdmin({ ...form, profilePhoto });
      }
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save dealer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Dealers" subtitle="One dealer per city. Orders route to the dealer for the customer's city." />

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {dealers.map((d) => (
            <div key={d._id} className="p-4 flex items-center gap-4">
              {d.profilePhoto ? (
                <img src={d.profilePhoto} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-brand-sunk shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{d.name}</p>
                <p className="text-xs text-brand-muted truncate">{d.city?.name ?? "—"} · {d.email}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(d)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(d._id)} />
              </div>
            </div>
          ))}
          {dealers.length === 0 && <EmptyState>No dealers yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit dealer" : "Add dealer"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <ImageUploader value={profilePhoto} onChange={setProfilePhoto} label="Profile photo" />
            <Field label="Dealer / business name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
            <Select label="City" required value={form.city} onChange={(e) => set("city", e.target.value)}>
              <option value="">Select city</option>
              {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
            <Field label="Province" value={form.province} onChange={(e) => set("province", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              <Field label="WhatsApp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </div>
            <Field
              label="Website (optional)"
              placeholder="https://example.com"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
            />
            <Field label="Login email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            <Field
              label={editingId ? "New password (leave blank to keep)" : "Login password"}
              type="password"
              required={!editingId}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add dealer"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
