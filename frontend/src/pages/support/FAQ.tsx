import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getFaqItems } from "../../api/endpoints";
import type { FaqItem } from "../../api/endpoints";
import { HiOutlineChevronDown } from "react-icons/hi";

export default function SupportFAQ() {
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    getFaqItems().then(setItems).catch(() => setItems([]));
  }, []);

  usePageMeta("Frequently Asked Questions", "Answers to common questions about ordering, delivery and products.");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Support", to: "/support/contact" }, { label: "FAQ" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-brand-slate text-sm md:text-base mb-10">
            Answers to common questions about ordering, delivery and products.
          </p>
        </Reveal>

        {items && items.length === 0 && (
          <p className="text-sm text-brand-muted">No questions published yet — check back soon.</p>
        )}

        <div className="flex flex-col divide-y divide-brand-border">
          {items?.map((item, i) => {
            const isOpen = openId === item._id;
            return (
              <Reveal key={item._id} delay={i * 0.04} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item._id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-semibold text-brand-navy">{item.question}</span>
                  <HiOutlineChevronDown
                    className={`shrink-0 text-brand-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-sm text-brand-slate leading-relaxed whitespace-pre-line">{item.answer}</p>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
