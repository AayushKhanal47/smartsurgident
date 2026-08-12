import { useEffect, useState } from "react";
import { getQuoteRequestsAdmin, updateQuoteStatusAdmin } from "../../api/endpoints";
import type { QuoteRequestRecord } from "../../api/endpoints";

const STATUSES = ["new", "in_progress", "quoted", "closed"] as const;

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);

  const load = () => getQuoteRequestsAdmin().then(setQuotes).catch(() => setQuotes([]));
  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateQuoteStatusAdmin(id, status);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Quote requests ({quotes.length})</h1>
      <div className="bg-white rounded-2xl divide-y divide-slate-100">
        {quotes.map((q) => (
          <div key={q._id} className="p-5 flex justify-between items-start gap-4">
            <div>
              <p className="text-sm font-medium text-brand-navy">{q.organizationName}</p>
              <p className="text-xs text-brand-muted mb-1">{q.contactName} · {q.phone} {q.email ? `· ${q.email}` : ""}</p>
              <p className="text-sm text-brand-slate">{q.items}</p>
              {q.message && <p className="text-xs text-brand-muted mt-1">{q.message}</p>}
            </div>
            <select
              value={q.status}
              onChange={(e) => handleStatusChange(q._id, e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs shrink-0"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        ))}
        {quotes.length === 0 && <p className="p-5 text-sm text-brand-muted">No quote requests yet.</p>}
      </div>
    </div>
  );
}
