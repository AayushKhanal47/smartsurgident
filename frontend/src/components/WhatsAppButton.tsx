import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineX } from "react-icons/hi";
import { getPublicDealers } from "../api/endpoints";
import { ADMIN_WHATSAPP_NUMBER, buildWhatsAppLink } from "../config/whatsapp";

interface CityContact {
  city: string;
  whatsapp: string;
}

type PanelView = "menu" | "cities";

const ADMIN_MESSAGE =
  "Hello Smart Surgident, I would like to know more about your dental and surgical equipment.";

const cityMessage = (city: string) =>
  `Hello Smart Surgident, I am interested in dental products and would like assistance from the ${city} dealer.`;

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>("menu");
  const [cities, setCities] = useState<CityContact[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const reduceMotion = useReducedMotion();
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
    setOpen((o) => !o);
    setView("menu");
  };

  const showCities = () => {
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
  };

  return (
    <div ref={containerRef} className="fixed z-50 right-4 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Smart Surgident on WhatsApp"
            initial={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[calc(100%+14px)] right-0 w-[288px] rounded-2xl bg-white border border-brand-border shadow-[0_20px_48px_rgba(31,44,65,0.18)] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-brand-border">
              <div className="flex items-center gap-2.5 min-w-0">
                {view === "cities" && (
                  <button
                    type="button"
                    onClick={() => setView("menu")}
                    aria-label="Back"
                    className="shrink-0 -ml-1 p-1 rounded-full text-brand-muted hover:text-brand-navy hover:bg-brand-tint transition-colors"
                  >
                    <HiOutlineChevronLeft className="text-lg" aria-hidden="true" />
                  </button>
                )}
                <p className="text-sm font-semibold text-brand-navy truncate">
                  {view === "menu" ? "Chat with us" : "Choose your city"}
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

            {view === "menu" ? (
              <div className="p-2.5 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={showCities}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-brand-tint transition-colors"
                >
                  <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand-tint text-brand-primary group-hover:bg-white transition-colors">
                    <HiOutlineUserGroup className="text-lg" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-brand-navy">Chat with Local Dealer</span>
                    <span className="block text-xs text-brand-muted">Get help from your city's dealer</span>
                  </span>
                </button>
                <a
                  href={buildWhatsAppLink(ADMIN_WHATSAPP_NUMBER, ADMIN_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-brand-tint transition-colors"
                >
                  <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand-tint text-brand-primary group-hover:bg-white transition-colors">
                    <HiOutlineOfficeBuilding className="text-lg" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-brand-navy">Chat with Smart Surgident Admin</span>
                    <span className="block text-xs text-brand-muted">General questions &amp; orders</span>
                  </span>
                </a>
              </div>
            ) : (
              <div className="p-2.5 max-h-72 overflow-y-auto">
                {cities === null && !loadError && (
                  <p className="px-3 py-4 text-sm text-brand-muted">Loading dealers…</p>
                )}
                {loadError && (
                  <p className="px-3 py-4 text-sm text-brand-muted">
                    Couldn't load dealers right now — please try again shortly.
                  </p>
                )}
                {cities && cities.length === 0 && (
                  <p className="px-3 py-4 text-sm text-brand-muted">No dealer WhatsApp numbers available yet.</p>
                )}
                {cities?.map((c) => (
                  <a
                    key={c.city}
                    href={buildWhatsAppLink(c.whatsapp, cityMessage(c.city))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-tint transition-colors"
                  >
                    {c.city}
                    <FaWhatsapp className="text-brand-muted shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp chat menu" : "Chat with Smart Surgident on WhatsApp"}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-[0_10px_28px_rgba(31,44,65,0.22)] ring-1 ring-black/[0.06] transition-shadow hover:shadow-[0_14px_34px_rgba(31,44,65,0.28)]"
      >
        {!open && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{ background: "#25D366", opacity: 0.18 }}
            animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.18, 0, 0.18] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {open ? (
          <HiOutlineX className="text-2xl text-brand-navy" aria-hidden="true" />
        ) : (
          <FaWhatsapp className="text-[28px]" style={{ color: "#25D366" }} aria-hidden="true" />
        )}
      </motion.button>
    </div>
  );
}
