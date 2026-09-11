import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineX } from "react-icons/hi";
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

type PanelView = "cities" | "confirm";

// "Order via WhatsApp": picks a city, then the order goes to BOTH that
// city's dealer (if one has a WhatsApp number) and Smart Surgident Admin —
// not a menu where the customer picks just one contact.
//
// Chrome (and other browsers) only allow ONE window.open() per click, even
// a genuine trusted click — a second call in the same handler is silently
// blocked, popup or not. So after picking a city we best-effort auto-open
// both, but always also render them as real, individually-clickable links
// so the order still reaches both contacts no matter what the browser did.
export default function OrderWhatsAppButton({
  buildDealerMessage,
  adminMessage,
  triggerClassName,
  children,
}: OrderWhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>("cities");
  const [cities, setCities] = useState<CityContact[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<CityContact | null>(null);
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
      if (next) {
        setView("cities");
        if (cities === null) {
          getPublicDealers()
            .then((dealers) => {
              const withWhatsapp = dealers
                .filter((d): d is typeof d & { whatsapp: string } => Boolean(d.whatsapp && d.city?.name))
                .map((d) => ({ city: d.city.name, whatsapp: d.whatsapp }));
              setCities(withWhatsapp);
            })
            .catch(() => setLoadError(true));
        }
      }
      return next;
    });
  };

  const dealerLink = selected ? buildWhatsAppLink(selected.whatsapp, buildDealerMessage(selected.city)) : null;
  const adminLink = buildWhatsAppLink(ADMIN_WHATSAPP_NUMBER, adminMessage);

  const pickCity = (contact: CityContact | null) => {
    setSelected(contact);
    setView("confirm");
    // Best effort: browsers allow only the first window.open() per click,
    // so this may only open one of the two — the confirm panel's own links
    // are the reliable path for whichever one didn't make it through.
    if (contact) window.open(buildWhatsAppLink(contact.whatsapp, buildDealerMessage(contact.city)), "_blank", "noopener,noreferrer");
    window.open(buildWhatsAppLink(ADMIN_WHATSAPP_NUMBER, adminMessage), "_blank", "noopener,noreferrer");
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
          aria-label="Order via WhatsApp"
          className="absolute z-30 top-[calc(100%+8px)] left-0 w-72 rounded-2xl bg-white border border-brand-border shadow-[0_20px_48px_rgba(31,44,65,0.18)] overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-brand-border">
            <div className="flex items-center gap-2 min-w-0">
              {view === "confirm" && (
                <button
                  type="button"
                  onClick={() => setView("cities")}
                  aria-label="Back"
                  className="shrink-0 -ml-1 p-1 rounded-full text-brand-muted hover:text-brand-navy hover:bg-brand-tint transition-colors"
                >
                  <HiOutlineChevronLeft className="text-lg" aria-hidden="true" />
                </button>
              )}
              <p className="text-sm font-semibold text-brand-navy truncate">
                {view === "cities" ? "Choose your city" : "Tap to message"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="shrink-0 p-1 rounded-full text-brand-muted hover:text-brand-navy hover:bg-brand-tint transition-colors"
            >
              <HiOutlineX className="text-lg" aria-hidden="true" />
            </button>
          </div>

          {view === "cities" ? (
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
                  onClick={() => pickCity(c)}
                  className="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-tint transition-colors text-left"
                >
                  {c.city}
                  <FaWhatsapp className="text-brand-muted shrink-0" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => pickCity(null)}
                className="w-full mt-1 pt-2 border-t border-brand-border text-left px-3 py-2.5 text-xs text-brand-muted hover:text-brand-primary transition-colors"
              >
                My city isn't listed / order via Admin only
              </button>
            </div>
          ) : (
            <div className="p-2.5 flex flex-col gap-1">
              <p className="px-2 pb-1 text-xs text-brand-muted">
                We tried opening these automatically — if your browser blocked it, tap below.
              </p>
              {dealerLink && selected && (
                <a
                  href={dealerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-brand-tint transition-colors"
                >
                  <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand-tint text-[#128C4A]">
                    <FaWhatsapp aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-brand-navy">{selected.city} Dealer</span>
                    <span className="block text-xs text-brand-muted">Message your local dealer</span>
                  </span>
                </a>
              )}
              <a
                href={adminLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-brand-tint transition-colors"
              >
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand-tint text-[#128C4A]">
                  <FaWhatsapp aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-brand-navy">Smart Surgident Admin</span>
                  <span className="block text-xs text-brand-muted">Message the admin team</span>
                </span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
