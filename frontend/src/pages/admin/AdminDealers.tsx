import { useEffect, useState } from "react";
import { getCities, getDealersAdmin, createDealerAdmin } from "../../api/endpoints";
import type { City } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";

interface DealerRow { _id: string; name: string; email: string; city?: { name: string } }

const emptyForm = { name: "", city: "", phone: "", email: "", password: "", province: "", whatsapp: "" };

export default function AdminDealers() {
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getDealersAdmin().then((d) => setDealers(d as DealerRow[])).catch(() => setDealers([]));
    getCities().then(setCities).catch(() => setCities([]));
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createDealerAdmin({ ...form, profilePhoto });
      setForm(emptyForm);
      setProfilePhoto("");
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to create dealer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Dealers</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-brand-navy mb-3">Existing dealers ({dealers.length})</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-100">
            {dealers.map((d) => (
              <div key={d._id} className="p-4">
                <p className="text-sm font-medium text-brand-navy">{d.name}</p>
                <p className="text-xs text-brand-muted">{d.city?.name} · {d.email}</p>
              </div>
            ))}
            {dealers.length === 0 && <p className="p-4 text-sm text-brand-muted">No dealers yet.</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-3 h-fit">
          <p className="text-sm font-medium text-brand-navy mb-1">Add dealer</p>
          <ImageUploader value={profilePhoto} onChange={setProfilePhoto} label="Profile photo" />
          <input required placeholder="Dealer / business name" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select required className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
            <option value="">Select city (one dealer per city)</option>
            {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input placeholder="Province (optional)" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
          <input required placeholder="Phone" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="WhatsApp (optional)" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <input required type="email" placeholder="Login email" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Login password" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add dealer"}</Button>
        </form>
      </div>
    </div>
  );
}
