import { useEffect, useMemo, useState } from "react";
import { getQuoteRequestsAdmin, updateQuoteStatusAdmin } from "../../api/endpoints";
import type { QuoteRequestRecord } from "../../api/endpoints";
import { PageHeader, Card, Select, Badge, EmptyState } from "./ui";

const STATUSES = ["new", "in_progress", "quoted", "closed"] as const;
const TONE: Record<string, "amber" | "green" | "slate" | "default"> = {
  new: "amber",
  in_progress: "default",
  quoted: "green",
  closed: "slate",
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = () => getQuoteRequestsAdmin().then(setQuotes).catch(() => setQuotes([]));
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateQuoteStatusAdmin(id, status);
    load();
  };

  const shown = useMemo(
    () => (filter === "all" ? quotes : quotes.filter((q) => q.status === filter)),
    [quotes, filter],
  );

  return (
    <div>
      <PageHeader
        title="Quote requests"
        subtitle={`${quotes.length} total · ${quotes.filter((q) => q.status === "new").length} new`}
        action={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </Select>
        }
      />

      <Card className="divide-y divide-brand-border overflow-hidden">
        {shown.map((q) => (
          <div key={q._id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-brand-navy">{q.organizationName}</p>
                <Badge tone={TONE[q.status] ?? "default"}>{q.status.replace("_", " ")}</Badge>
              </div>
              <p className="text-xs text-brand-muted mt-1">
                {q.contactName} · {q.phone}{q.email ? ` · ${q.email}` : ""} · {new Date(q.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-brand-slate mt-2 whitespace-pre-wrap">{q.items}</p>
              {q.message && <p className="text-xs text-brand-muted mt-1.5 whitespace-pre-wrap">{q.message}</p>}
            </div>
            <Select
              className="sm:w-40 shrink-0"
              value={q.status}
              onChange={(e) => handleStatusChange(q._id, e.target.value)}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </Select>
          </div>
        ))}
        {shown.length === 0 && <EmptyState>{quotes.length === 0 ? "No quote requests yet." : "None with this status."}</EmptyState>}
      </Card>
    </div>
  );
}
