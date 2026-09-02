import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiMenu, HiX, HiChevronDown, HiOutlineSearch, HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import Logo from "./ui/Logo";
import { ButtonLink } from "./ui/Button";

interface NavItem {
  label: string;
  to: string;
  megaMenu?: { label: string; to: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Products", to: "/products" },
  { label: "Brands", to: "/brands" },
  {
    label: "Company",
    to: "/company/about",
    megaMenu: [
      { label: "About us", to: "/company/about" },
      { label: "Facilities", to: "/company/facilities" },
      { label: "News", to: "/company/news" },
      { label: "Events", to: "/company/events" },
      { label: "Careers", to: "/company/careers" },
    ],
  },
  {
    label: "Support",
    to: "/support/contact",
    megaMenu: [
      { label: "Contact us", to: "/support/contact" },
      { label: "FAQ", to: "/support/faq" },
      { label: "Warranty", to: "/support/warranty" },
      { label: "Request a quote", to: "/support/quote" },
    ],
  },
  { label: "E-Library", to: "/resources" },
  { label: "Dealer Network", to: "/dealers" },
];

function SearchField({ onSubmit, className = "" }: { onSubmit?: () => void; className?: string }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(q.trim() ? `/products?search=${encodeURIComponent(q.trim())}` : "/products");
        onSubmit?.();
      }}
      className={`relative ${className}`}
    >
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-base" aria-hidden="true" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search equipment…"
        aria-label="Search products"
        className="w-full h-9 pl-9 pr-3 rounded-full bg-white/80 border border-brand-border text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:bg-white"
      />
    </form>
  );
}

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { pathname } = useLocation();

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
        <Logo />

        <nav className="hidden lg:flex items-center gap-0.5 ml-2">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.megaMenu && setOpenMenu(item.label)}
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
                {item.label}
                {item.megaMenu && <HiChevronDown className="text-xs" aria-hidden="true" />}
              </NavLink>

              <AnimatePresence>
                {item.megaMenu && openMenu === item.label && (
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
                          key={sub.label}
                          to={sub.to}
                          className="block px-3.5 py-2.5 rounded-xl text-sm text-brand-navy hover:bg-brand-bg transition-colors"
                        >
                          {sub.label}
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
          <SearchField className="hidden xl:block w-52" />

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

          <ButtonLink to="/support/quote" className="hidden md:inline-flex">
            Talk to an Expert
          </ButtonLink>

          <button
            className="lg:hidden p-2 -mr-2 text-brand-navy"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-brand-border"
          >
            <div className="px-5 py-4 flex flex-col">
              <SearchField className="mb-3" onSubmit={() => setMobileOpen(false)} />
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-brand-border/70 last:border-0">
                  <Link to={item.to} className="block py-3.5 text-[15px] font-medium text-brand-navy">
                    {item.label}
                  </Link>
                  {item.megaMenu && (
                    <div className="pb-2 pl-3 flex flex-col">
                      {item.megaMenu.map((sub) => (
                        <Link key={sub.label} to={sub.to} className="py-2 text-sm text-brand-slate">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <ButtonLink to="/support/quote" className="mt-4 w-full">
                Talk to an Expert
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
