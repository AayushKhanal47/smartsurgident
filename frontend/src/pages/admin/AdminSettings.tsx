import { useEffect, useState } from "react";
import {
  getAdminsAdmin,
  createAdminAdmin,
  resetAdminPasswordAdmin,
  deleteAdminAdmin,
  changeMyPasswordAdmin,
} from "../../api/endpoints";
import type { AdminAccount } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import { PageHeader, Card, Field, EmptyState, DangerButton } from "./ui";

function errorMessage(err: unknown, fallback: string) {
  const message = err && typeof err === "object" && "response" in err
    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
    : undefined;
  return message || fallback;
}

function ResetPasswordRow({ admin, onDone }: { admin: AdminAccount; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">
        Reset password
      </button>
    );
  }

  const submit = async () => {
    setError("");
    if (password.length < 8) {
      setError("At least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await resetAdminPasswordAdmin(admin._id, password);
      setOpen(false);
      setPassword("");
      onDone();
    } catch (err) {
      setError(errorMessage(err, "Failed to reset password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <PasswordInput
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="w-36 rounded-lg border border-brand-border px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary"
      />
      <button onClick={submit} disabled={submitting} className="text-xs font-semibold text-brand-primary disabled:opacity-40">
        Save
      </button>
      <button onClick={() => { setOpen(false); setError(""); }} className="text-xs text-brand-muted hover:text-brand-navy">
        Cancel
      </button>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}

export default function AdminSettings() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const load = () => getAdminsAdmin().then(setAdmins).catch(() => setAdmins([]));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      await createAdminAdmin(form);
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (err) {
      setCreateError(errorMessage(err, "Failed to create admin"));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (admin: AdminAccount) => {
    if (!confirm(`Remove ${admin.name} as an admin? They will lose access immediately.`)) return;
    try {
      await deleteAdminAdmin(admin._id);
      load();
    } catch (err) {
      alert(errorMessage(err, "Failed to remove admin"));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    setPwSubmitting(true);
    try {
      await changeMyPasswordAdmin(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: "", newPassword: "" });
      setPwSuccess(true);
    } catch (err) {
      setPwError(errorMessage(err, "Failed to change password"));
    } finally {
      setPwSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Admin settings"
        subtitle="Manage who has admin access, and change your own login password."
      />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {admins.map((a) => (
            <div key={a._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{a.name}</p>
                <p className="text-xs text-brand-muted truncate">
                  {a.email} · added {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <ResetPasswordRow admin={a} onDone={load} />
                <DangerButton onClick={() => handleDelete(a)} />
              </div>
            </div>
          ))}
          {admins.length === 0 && <EmptyState>No admins found.</EmptyState>}
        </Card>

        <div className="flex flex-col gap-8">
          <Card className="p-6 flex flex-col gap-3.5">
            <p className="text-sm font-semibold text-brand-navy">Add an admin</p>
            <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
              <Field label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Field label="Email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              <Field
                label="Password"
                type="password"
                required
                minLength={8}
                hint="At least 8 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              {createError && <p className="text-sm text-red-500">{createError}</p>}
              <Button type="submit" disabled={creating} className="justify-center">
                {creating ? "Adding…" : "Add admin"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 flex flex-col gap-3.5">
            <p className="text-sm font-semibold text-brand-navy">Change my password</p>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3.5">
              <Field
                label="Current password"
                type="password"
                required
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              />
              <Field
                label="New password"
                type="password"
                required
                minLength={8}
                hint="At least 8 characters"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              />
              {pwError && <p className="text-sm text-red-500">{pwError}</p>}
              {pwSuccess && <p className="text-sm text-emerald-600">Password updated.</p>}
              <Button type="submit" disabled={pwSubmitting} variant="secondary" className="justify-center">
                {pwSubmitting ? "Saving…" : "Update password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
