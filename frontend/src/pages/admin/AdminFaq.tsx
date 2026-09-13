import { useEffect, useState } from "react";
import {
  getAllFaqItemsAdmin,
  createFaqItemAdmin,
  updateFaqItemAdmin,
  deleteFaqItemAdmin,
} from "../../api/endpoints";
import type { FaqItem } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { PageHeader, Card, Field, Textarea, Toggle, Badge, EmptyState, DangerButton } from "./ui";

const empty = { question: "", answer: "", order: "0", isPublished: true };

export default function AdminFaq() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getAllFaqItemsAdmin().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
    setError("");
  };

  const startEdit = (item: FaqItem) => {
    setEditingId(item._id);
    setForm({ question: item.question, answer: item.answer, order: String(item.order), isPublished: item.isPublished });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ item? This cannot be undone.")) return;
    await deleteFaqItemAdmin(id);
    if (editingId === id) reset();
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = { ...form, order: Number(form.order) || 0 };
      if (editingId) await updateFaqItemAdmin(editingId, data);
      else await createFaqItemAdmin(data);
      reset();
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to save FAQ item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="FAQ" subtitle={`${items.length} question${items.length === 1 ? "" : "s"}`} />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <Card className="divide-y divide-brand-border overflow-hidden">
          {items.map((item) => (
            <div key={item._id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-navy truncate">{item.question}</p>
                <p className="text-xs text-brand-muted">Order {item.order}</p>
              </div>
              {!item.isPublished && <Badge tone="amber">Hidden</Badge>}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(item)} className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover">Edit</button>
                <DangerButton onClick={() => handleDelete(item._id)} />
              </div>
            </div>
          ))}
          {items.length === 0 && <EmptyState>No FAQ items yet.</EmptyState>}
        </Card>

        <Card className="p-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">{editingId ? "Edit question" : "Add question"}</p>
            {editingId && <button onClick={reset} className="text-xs text-brand-muted hover:text-brand-navy">Cancel</button>}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label="Question" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <Textarea label="Answer" rows={4} required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            <Field label="Order" type="number" hint="lower shows first" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <Toggle label="Published" checked={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="justify-center">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add question"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
