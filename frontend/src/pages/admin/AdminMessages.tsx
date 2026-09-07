import { useEffect, useMemo, useState } from "react";
import { getContactMessagesAdmin, updateContactMessageStatusAdmin } from "../../api/endpoints";
import type { ContactMessageRecord } from "../../api/endpoints";
import { PageHeader, Card, Select, Badge, EmptyState } from "./ui";

const STATUSES = ["new", "read"] as const;
const TONE: Record<string, "amber" | "green" | "slate" | "default"> = {
  new: "amber",
  read: "slate",
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = () => getContactMessagesAdmin().then(setMessages).catch(() => setMessages([]));
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateContactMessageStatusAdmin(id, status);
    load();
  };

  const shown = useMemo(
    () => (filter === "all" ? messages : messages.filter((m) => m.status === filter)),
    [messages, filter],
  );

  return (
    <div>
      <PageHeader
        title="Contact messages"
        subtitle={`${messages.length} total · ${messages.filter((m) => m.status === "new").length} new`}
        action={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        }
      />

      <Card className="divide-y divide-brand-border overflow-hidden">
        {shown.map((m) => (
          <div key={m._id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-brand-navy">{m.name}</p>
                <Badge tone={TONE[m.status] ?? "default"}>{m.status}</Badge>
              </div>
              <p className="text-xs text-brand-muted mt-1">
                {m.email} · {new Date(m.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-brand-slate mt-2 whitespace-pre-wrap">{m.message}</p>
            </div>
            <Select
              className="sm:w-32 shrink-0"
              value={m.status}
              onChange={(e) => handleStatusChange(m._id, e.target.value)}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        ))}
        {shown.length === 0 && <EmptyState>{messages.length === 0 ? "No messages yet." : "None with this status."}</EmptyState>}
      </Card>
    </div>
  );
}
