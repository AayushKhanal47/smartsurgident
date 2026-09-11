import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { getPublicDealers } from "../api/endpoints";
import { ADMIN_WHATSAPP_NUMBER, buildWhatsAppLink } from "../config/whatsapp";

interface CityContact {
  city: string;
  whatsapp: string;
}

interface OrderWhatsAppButtonProps {
  // Message sent to the city's dealer once one is picked.
  buildDealerMessage: (city: string) => string;
  // Message always sent to Smart Surgident Admin, dealer or not.
  adminMessage: string;
  triggerClassName?: string;
  children?: ReactNode;
}

// "Order via WhatsApp": picks a city, then opens a chat with that city's
// dealer (if one has a WhatsApp number) AND a chat with Admin, so the order
// reaches both — not a menu where the customer picks just one contact.
export default function OrderWhatsAppButton({
  buildDealerMessage,
  adminMessage,
  triggerClassName,
  children,
}: OrderWhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<CityContact[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const toggle = () => {
    setOpen((wasOpen) => {
      const next = !wasOpen;
      if (next && cities === null) {
        getPublicDealers()
          .then((dealers) => {
            const withWhatsapp = dealers
              .filter((d): d is typeof d & { whatsapp: string } => Boolean(d.whatsapp && d.city?.name))
              .map((d) => ({ city: d.city.name, whatsapp: d.whatsapp }));
            setCities(withWhatsapp);
          })
          .catch(() => setLoadError(true));
      }
      return next;
    });
  };

  // Both window.open calls run synchronously inside the click handler so
  // neither is treated as an unrequested popup by the browser.
  const orderFor = (contact: CityContact | null) => {
    if (contact) {
      window.open(buildWhatsAppLink(contact.whatsapp, buildDealerMessage(contact.city)), "_blank", "noopener,noreferrer");
    }
    window.open(buildWhatsAppLink(ADMIN_WHATSAPP_NUMBER, adminMessage), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={
          triggerClassName ??
          "inline-flex items-center justify-center gap-2 rounded-full px-6 min-h-11 py-2.5 text-sm font-medium bg-white text-brand-navy border border-brand-border hover:border-[#25D366] hover:text-[#128C4A] transition-colors"
        }
      >
        {children ?? (
          <>
            <FaWhatsapp style={{ color: "#25D366" }} aria-hidden="true" />
            Order via WhatsApp
          </>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose your city to order via WhatsApp"
          className="absolute z-30 top-[calc(100%+8px)] left-0 w-72 rounded-2xl bg-white border border-brand-border shadow-[0_20px_48px_rgba(31,44,65,0.18)] overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-brand-border">
            <p className="text-sm font-semibold text-brand-navy">Choose your city</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="shrink-0 p-1 rounded-full text-brand-muted hover:text-brand-navy hover:bg-brand-tint transition-colors"
            >
              <HiOutlineX className="text-lg" aria-hidden="true" />
            </button>
          </div>
          <div className="p-2 max-h-64 overflow-y-auto">
            {cities === null && !loadError && (
              <p className="px-3 py-4 text-sm text-brand-muted">Loading dealers…</p>
            )}
            {loadError && (
              <p className="px-3 py-4 text-sm text-brand-muted">
                Couldn't load dealers right now. Please try again shortly.
              </p>
            )}
            {cities?.map((c) => (
              <button
                key={c.city}
                type="button"
                onClick={() => orderFor(c)}
                className="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-tint transition-colors text-left"
              >
                {c.city}
                <FaWhatsapp className="text-brand-muted shrink-0" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => orderFor(null)}
              className="w-full mt-1 pt-2 border-t border-brand-border text-left px-3 py-2.5 text-xs text-brand-muted hover:text-brand-primary transition-colors"
            >
              My city isn't listed / order via Admin only
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
