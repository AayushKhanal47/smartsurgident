import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiMenu, HiX, HiChevronDown, HiOutlineSearch, HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import Logo from "./ui/Logo";
import { ButtonLink } from "./ui/Button";
import LanguageToggle from "./ui/LanguageToggle";
import { useTranslation } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n/translations";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { getProducts } from "../api/endpoints";
import type { Product } from "../api/endpoints";
import { getResizedImageUrl } from "../utils/productImage";

interface NavItem {
  labelKey: TranslationKey;
  to: string;
  megaMenu?: { labelKey: TranslationKey; to: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.products", to: "/products" },
  { labelKey: "nav.brands", to: "/brands" },
  {
    labelKey: "nav.company",
    to: "/company/about",
    megaMenu: [
      { labelKey: "company.about", to: "/company/about" },
      { labelKey: "company.facilities", to: "/company/facilities" },
      { labelKey: "company.news", to: "/company/news" },
      { labelKey: "company.events", to: "/company/events" },
      { labelKey: "company.careers", to: "/company/careers" },
    ],
  },
  {
    labelKey: "nav.support",
    to: "/support/contact",
    megaMenu: [
      { labelKey: "support.contact", to: "/support/contact" },
      { labelKey: "support.faq", to: "/support/faq" },
      { labelKey: "support.warranty", to: "/support/warranty" },
      { labelKey: "support.quote", to: "/support/quote" },
    ],
  },
  { labelKey: "nav.elibrary", to: "/resources" },
  { labelKey: "nav.dealerNetwork", to: "/dealers" },
];

const SUGGESTION_LIMIT = 6;

function SearchField({ onSubmit, className = "" }: { onSubmit?: () => void; className?: string }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const debouncedQ = useDebouncedValue(q, 250);
  const requestIdRef = useRef(0);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const query = debouncedQ.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }
    const requestId = ++requestIdRef.current;
    getProducts({ search: query, limit: SUGGESTION_LIMIT })
      .then((data) => {
        if (requestId === requestIdRef.current) setSuggestions(data);
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setSuggestions([]);
      });
  }, [debouncedQ]);

  // Close on an outside click — a plain dropdown, not a modal, so Escape
  // and clicking away both just dismiss it rather than needing a portal.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const goToResults = () => {
    navigate(q.trim() ? `/products?search=${encodeURIComponent(q.trim())}` : "/products");
    setOpen(false);
    onSubmit?.();
  };

  return (
    <form
      ref={containerRef}
      onSubmit={(e) => {
        e.preventDefault();
        goToResults();
      }}
      className={`relative ${className}`}
    >
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-base" aria-hidden="true" />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => q.trim() && setOpen(true)}
        placeholder={t("nav.searchPlaceholder")}
        aria-label="Search products"
        autoComplete="off"
        className="w-full h-9 pl-9 pr-3 rounded-full bg-white/80 border border-brand-border text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:bg-white"
      />

      {open && q.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-border shadow-[0_16px_40px_-12px_rgba(31,44,65,0.22)] overflow-hidden z-10">
          {suggestions.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto py-1.5">
                {suggestions.map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/products/${p.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onSubmit?.();
                      }}
                      className="flex items-center gap-3 px-3.5 py-2 hover:bg-brand-bg transition-colors"
                    >
                      <span className="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-brand-sunk">
                        {p.images[0] && (
                          <img
                            src={getResizedImageUrl(p.images[0], 72)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-brand-navy truncate">{p.name}</span>
                        {p.brand?.name && (
                          <span className="block text-xs text-brand-muted truncate">{p.brand.name}</span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-brand-primary border-t border-brand-border hover:bg-brand-bg transition-colors"
              >
                View all results for "{q.trim()}"
              </button>
            </>
          ) : (
            <p className="px-3.5 py-3 text-sm text-brand-muted">No products found for "{q.trim()}"</p>
          )}
        </div>
      )}
    </form>
  );
}

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "border-b border-brand-border shadow-[0_8px_28px_-14px_rgba(31,44,65,0.22)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-16 md:h-[72px] flex items-center gap-6">
        <Logo className="[&>span]:hidden sm:[&>span]:inline" />

        <nav className="hidden lg:flex items-center gap-0.5 ml-2">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.labelKey}
              className="relative"
              onMouseEnter={() => item.megaMenu && setOpenMenu(item.labelKey)}
              onMouseLeave={() => item.megaMenu && setOpenMenu(null)}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-2 rounded-full text-[13.5px] font-medium transition-colors ${
                    isActive ? "text-brand-primary" : "text-brand-navy hover:text-brand-primary"
                  }`
                }
              >
                {t(item.labelKey)}
                {item.megaMenu && <HiChevronDown className="text-xs" aria-hidden="true" />}
              </NavLink>

              <AnimatePresence>
                {item.megaMenu && openMenu === item.labelKey && (
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full left-0 pt-2 w-56"
                  >
                    <div className="bg-white rounded-2xl border border-brand-border shadow-[0_16px_40px_-12px_rgba(31,44,65,0.22)] p-2">
                      {item.megaMenu.map((sub) => (
                        <Link
                          key={sub.labelKey}
                          to={sub.to}
                          className="block px-3.5 py-2.5 rounded-xl text-sm text-brand-navy hover:bg-brand-bg transition-colors"
                        >
                          {t(sub.labelKey)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageToggle className="!hidden sm:!inline-flex" />
          <SearchField className="hidden xl:block w-52" />

          <button
            className="xl:hidden p-2 text-brand-navy hover:text-brand-primary transition-colors"
            aria-label={mobileSearchOpen ? "Close search" : "Search"}
            aria-expanded={mobileSearchOpen}
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              setMobileOpen(false);
            }}
          >
            {mobileSearchOpen ? <HiX className="text-xl" /> : <HiOutlineSearch className="text-xl" />}
          </button>

          <Link
            to="/cart"
            className="relative p-2 text-brand-navy hover:text-brand-primary transition-colors"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <HiOutlineShoppingBag className="text-xl" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <ButtonLink to="/support/quote" className="!hidden md:!inline-flex">
            {t("nav.talkToExpert")}
          </ButtonLink>

          <button
            className="lg:hidden p-2 -mr-2 text-brand-navy"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileSearchOpen(false);
            }}
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="xl:hidden bg-white border-t border-brand-border"
          >
            <div className="px-5 py-3.5">
              <SearchField onSubmit={() => setMobileSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-brand-border max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-5 py-4 flex flex-col">
              <LanguageToggle className="mb-3 sm:hidden" />
              {NAV_ITEMS.map((item) => (
                <div key={item.labelKey} className="border-b border-brand-border/70 last:border-0">
                  <Link to={item.to} className="block py-3.5 text-[15px] font-medium text-brand-navy">
                    {t(item.labelKey)}
                  </Link>
                  {item.megaMenu && (
                    <div className="pb-2 pl-3 flex flex-col">
                      {item.megaMenu.map((sub) => (
                        <Link key={sub.labelKey} to={sub.to} className="py-2 text-sm text-brand-slate">
                          {t(sub.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <ButtonLink to="/support/quote" className="mt-4 w-full">
                {t("nav.talkToExpert")}
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
