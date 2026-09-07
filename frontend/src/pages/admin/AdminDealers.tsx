import { useEffect, useState } from "react";
import {
  getCities,
  getBrands,
  getDealersAdmin,
  createDealerAdmin,
  updateDealerAdmin,
  deleteDealerAdmin,
} from "../../api/endpoints";
import type { City, Brand } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";
import { PageHeader, Card, Field, Textarea, Select, EmptyState, DangerButton } from "./ui";

interface DealerRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  province?: string;
  whatsapp?: string;
  website?: string;
  profilePhoto?: string;
  logo?: string;
  storePhotos?: string[];
  address?: string;
  openingHours?: string;
  description?: string;
  yearsInOperation?: number;
  services?: string[];
  brandsCarried?: { _id: string }[];
  city?: { _id?: string; name?: string };
}

const empty = {
  name: "",
  city: "",
  phone: "",
  email: "",
  password: "",
  province: "",
  whatsapp: "",
  website: "",
  address: "",
  openingHours: "",
  description: "",
  yearsInOperation: "",
  services: "",
};

export default function AdminDealers() {
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(empty);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [logo, setLogo] = useState("");
  const [storePhotos, setStorePhotos] = useState<string[]>([]);
  const [brandsCarried, setBrandsCarried] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getDealersAdmin().then((d) => setDealers(d as DealerRow[])).catch(() => setDealers([]));
    getCities().then(setCities).catch(() => setCities([]));
    getBrands().then(setBrands).catch(() => setBrands([]));
  };
  useEffect(() => { load(); }, []);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const toggleBrand = (id: string) =>
    setBrandsCarried((current) => (current.includes(id) ? current.filter((b) => b !== id) : [...current, id]));

  const reset = () => {
    setForm(empty);
    setProfilePhoto("");
    setLogo("");
    setStorePhotos([]);
    setBrandsCarried([]);
    setEditingId(null);
    setError("");
  };

  const startEdit = (d: DealerRow) => {
    setEditingId(d._id);
    setForm({
      name: d.name, city: d.city?._id ?? "", phone: d.phone ?? "", email: d.email,
      password: "", province: d.province ?? "", whatsapp: d.whatsapp ?? "", website: d.website ?? "",
      address: d.address ?? "", openingHours: d.openingHours ?? "", description: d.description ?? "",
      yearsInOperation: d.yearsInOperation != null ? String(d.yearsInOperation) : "",
      services: (d.services ?? []).join(", "),
    });
    setProfilePhoto(d.profilePhoto ?? "");
    setLogo(d.logo ?? "");
    setStorePhotos(d.storePhotos ?? []);
    setBrandsCarried((d.brandsCarried ?? []).map((b) => b._id));
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
      const { password, yearsInOperation, services, ...rest } = form;
      const payload = {
        ...rest,
        profilePhoto,
        logo,
        storePhotos,
        brandsCarried,
        services: services.split(",").map((s) => s.trim()).filter(Boolean),
        yearsInOperation: yearsInOperation ? Number(yearsInOperation) : undefined,
      };
      if (editingId) {
        await updateDealerAdmin(editingId, { ...payload, ...(password ? { password } : {}) });
      } else {
        await createDealerAdmin({ ...payload, password });
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

            <div className="border-t border-brand-border pt-3.5 mt-1 flex flex-col gap-3.5">
              <p className="text-xs font-semibold text-brand-navy uppercase tracking-[0.06em]">Public profile</p>
              <p className="text-[11px] text-brand-muted -mt-2">
                Shown on this dealer's public page in the Dealer Network directory.
              </p>
              <ImageUploader value={logo} onChange={setLogo} label="Logo (optional)" />
              <MultiImageUploader value={storePhotos} onChange={setStorePhotos} label="Store photos" max={8} />
              <Field label="Address" value={form.address} onChange={(e) => set("address", e.target.value)} />
              <Textarea
                label="Description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Opening hours" placeholder="Sun–Fri, 10am–6pm" value={form.openingHours} onChange={(e) => set("openingHours", e.target.value)} />
                <Field label="Years in operation" type="number" min={0} value={form.yearsInOperation} onChange={(e) => set("yearsInOperation", e.target.value)} />
              </div>
              <Field
                label="Services"
                hint="Comma-separated, e.g. Repair, Installation, Spare parts"
                value={form.services}
                onChange={(e) => set("services", e.target.value)}
              />
              {brands.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-brand-slate mb-1.5">Brands carried</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {brands.map((b) => (
                      <label key={b._id} className="inline-flex items-center gap-1.5 text-xs text-brand-navy">
                        <input
                          type="checkbox"
                          checked={brandsCarried.includes(b._id)}
                          onChange={() => toggleBrand(b._id)}
                        />
                        {b.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
