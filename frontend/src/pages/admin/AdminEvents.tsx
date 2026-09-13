import { useEffect, useState } from "react";
import {
  getAllEventsAdmin,
  createEventAdmin,
  updateEventAdmin,
  deleteEventAdmin,
} from "../../api/endpoints";
import type { EventItem } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { PageHeader, Card, Field, Textarea, Toggle, Badge, EmptyState, DangerButton } from "./ui";

const todayISO = () => new Date().toISOString().slice(0, 10);
const empty = { title: "", date: todayISO(), location: "", body: "", isPublished: false };

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllEventsAdmin().then(setEvents).catch(() => setEvents([]));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
    setError("");
  };

  const startEdit = (ev: EventItem) => {
    setEditingId(ev._id);
    setForm({ title: ev.title, date: ev.date.slice(0, 10), location: ev.location ?? "", body: ev.body, isPublished: ev.isPublished });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await deleteEventAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) await updateEventAdmin(editingId, form);
      else await createEventAdmin(form);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Events" subtitle={`${events.length} event${events.length === 1 ? "" : "s"}`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {events.map((ev) => (
            <div key={ev._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{ev.title}</p>
                <p className="text-xs text-brand-muted">
                  {new Date(ev.date).toLocaleDateString()}{ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>
              {!ev.isPublished && <Badge tone="amber">Draft</Badge>}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(ev)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(ev._id)} />
              </div>
            </div>
          ))}
          {events.length === 0 && <EmptyState>No events yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit event" : "Add event"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Field label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Field label="Location" hint="optional" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Textarea label="Details" rows={5} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Toggle label="Published" checked={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add event"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
