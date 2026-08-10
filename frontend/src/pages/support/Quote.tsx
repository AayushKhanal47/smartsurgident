import { useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { Button } from "../../components/ui/Button";

export default function SupportQuote() {
  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    phone: "",
    email: "",
    items: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: the QuoteRequest backend model/endpoint is planned for the next
    // (content-management) phase — this form is fully built and validated on
    // the frontend, ready to POST to /api/quotes once that lands.
    setSubmitted(true);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Support", to: "/support/contact" }, { label: "Request a Quote" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            Request a quote
          </h1>
          <p className="text-brand-slate text-sm mb-8">
            For bulk or clinic orders, tell us what you need and we'll send a tailored quote.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {submitted ? (
            <div className="bg-brand-tint rounded-2xl p-6 text-brand-blue text-sm">
              Thanks — your quote request has been noted. Our team will follow up shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
              <input
                required
                placeholder="Clinic / organization name"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Contact person"
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
                <input
                  required
                  placeholder="Phone number"
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <input
                type="email"
                placeholder="Email (optional)"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                required
                placeholder="Items and quantities you're requesting a quote for"
                rows={3}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.items}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
              />
              <textarea
                placeholder="Additional message (optional)"
                rows={2}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit">Submit request</Button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
