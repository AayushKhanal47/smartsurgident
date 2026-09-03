import { useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { Button } from "../../components/ui/Button";
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { ADMIN_WHATSAPP_NUMBER, buildWhatsAppLink } from "../../config/whatsapp";
import { usePageMeta } from "../../hooks/usePageMeta";

export default function SupportContact() {
  usePageMeta(
    "Contact Us",
    "Reach Smart Surgident for product questions, orders, or dealer inquiries — dental and surgical equipment distribution across Nepal."
  );

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Support", to: "/support/contact" }, { label: "Contact" }]} />

      <div className="px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 max-w-5xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            Contact us
          </h1>
          <p className="text-brand-slate text-sm mb-8">
            Reach out for product questions, orders, or dealer inquiries.
          </p>

          <div className="flex flex-col gap-4 text-sm text-brand-navy">
            <span className="flex items-center gap-3">
              <HiOutlineLocationMarker className="text-brand-blue text-lg shrink-0" aria-hidden="true" />
              Kathmandu, Nepal
            </span>
            <span className="flex items-center gap-3">
              <HiOutlinePhone className="text-brand-blue text-lg shrink-0" aria-hidden="true" />
              01-4XXXXXX
            </span>
            <span className="flex items-center gap-3">
              <HiOutlineMail className="text-brand-blue text-lg shrink-0" aria-hidden="true" />
              info@smartsurgident.com
            </span>
            <a
              href={buildWhatsAppLink(
                ADMIN_WHATSAPP_NUMBER,
                "Hello Smart Surgident, I have a question about your dental equipment."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-brand-blue transition-colors"
            >
              <FaWhatsapp className="text-brand-blue text-lg shrink-0" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {submitted ? (
            <div className="bg-brand-tint rounded-2xl p-6 text-brand-blue text-sm">
              Thanks — your message has been noted. We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
              <input
                required
                placeholder="Your name"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                required
                placeholder="Message"
                rows={4}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit">Send message</Button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}