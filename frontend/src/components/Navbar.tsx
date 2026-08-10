import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import Logo from "./ui/Logo";
import { ButtonLink } from "./ui/Button";

interface NavItem {
  label: string;
  to: string;
  megaMenu?: { label: string; to: string; description?: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Products",
    to: "/products",
    megaMenu: [
      { label: "All products", to: "/products", description: "Browse the full catalog" },
      { label: "Hand instruments", to: "/products?category=hand-instruments" },
      { label: "Rotary & burs", to: "/products?category=rotary-burs" },
      { label: "Chairside materials", to: "/products?category=chairside-materials" },
      { label: "Sterilization", to: "/products?category=sterilization" },
    ],
  },
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

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white/95 backdrop-blur"
      }`}
    >
      <div className="px-6 md:px-10 h-[72px] flex items-center gap-8 max-w-[1400px] mx-auto">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1 flex-1">
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
                  `flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "text-brand-blue" : "text-brand-navy hover:bg-brand-tint"
                  }`
                }
              >
                {item.label}
                {item.megaMenu && <HiChevronDown className="text-xs" aria-hidden="true" />}
              </NavLink>

              <AnimatePresence>
                {item.megaMenu && openMenu === item.label && (
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 pt-2 w-64"
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2">
                      {item.megaMenu.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className="block px-4 py-2.5 rounded-xl text-sm text-brand-navy hover:bg-brand-tint transition-colors"
                        >
                          <p className="font-medium">{sub.label}</p>
                          {sub.description && (
                            <p className="text-xs text-brand-muted mt-0.5">{sub.description}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link to="/cart" className="text-sm font-medium text-brand-navy px-3 py-2">
            Cart ({count})
          </Link>
          <ButtonLink to="/support/quote" className="!px-5 !py-2.5">
            Request a Quote
          </ButtonLink>
        </div>

        <button
          className="lg:hidden ml-auto text-brand-navy text-2xl"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-slate-100"
          >
            <nav className="px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-sm font-medium text-brand-navy"
                  >
                    {item.label}
                  </Link>
                  {item.megaMenu && (
                    <div className="pl-4 flex flex-col gap-0.5 mb-1">
                      {item.megaMenu.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className="py-1.5 text-xs text-brand-slate"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-brand-navy"
              >
                Cart ({count})
              </Link>
              <ButtonLink to="/support/quote" className="mt-2 justify-center">
                Request a Quote
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
