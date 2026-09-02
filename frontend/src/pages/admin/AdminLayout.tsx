import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HiMenu,
  HiX,
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineViewGrid,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineSpeakerphone,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineExternalLink,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Logo from "../../components/ui/Logo";

const GROUPS: { heading: string; links: { label: string; to: string; icon: typeof HiOutlineHome; end?: boolean }[] }[] = [
  {
    heading: "Overview",
    links: [{ label: "Dashboard", to: "/admin", icon: HiOutlineHome, end: true }],
  },
  {
    heading: "Catalogue",
    links: [
      { label: "Products", to: "/admin/products", icon: HiOutlineCube },
      { label: "Categories", to: "/admin/categories", icon: HiOutlineViewGrid },
      { label: "Brands", to: "/admin/brands", icon: HiOutlineTag },
      { label: "Catalogue PDFs", to: "/admin/resources", icon: HiOutlineBookOpen },
    ],
  },
  {
    heading: "Network & marketing",
    links: [
      { label: "Dealers", to: "/admin/dealers", icon: HiOutlineUserGroup },
      { label: "Campaigns", to: "/admin/campaigns", icon: HiOutlineSpeakerphone },
    ],
  },
  {
    heading: "Enquiries",
    links: [{ label: "Quote requests", to: "/admin/quotes", icon: HiOutlineClipboardList }],
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/admin/login");
    }
  };

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
      {GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-muted">
            {group.heading}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-brand-navy hover:bg-brand-bg"
                  }`
                }
              >
                <link.icon className="text-base shrink-0" aria-hidden="true" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-brand-border p-3">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-brand-slate hover:bg-brand-bg transition-colors"
      >
        <HiOutlineExternalLink className="text-base" aria-hidden="true" /> View site
      </a>
      <div className="mt-2 flex items-center justify-between px-3 py-2">
        <span className="text-xs text-brand-muted truncate">{admin?.name ?? "Admin"}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
        >
          <HiOutlineLogout className="text-sm" aria-hidden="true" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg lg:flex">
      {/* Mobile bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-brand-border h-14 flex items-center justify-between px-4">
        <Logo />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-brand-navy p-1"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-brand-navy/40" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute top-14 left-0 bottom-0 w-72 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
            {footer}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-64 bg-white border-r border-brand-border flex-col shrink-0">
        <div className="p-5 border-b border-brand-border">
          <Logo />
        </div>
        {nav}
        {footer}
      </aside>

      <main className="flex-1 min-w-0 p-5 lg:p-10 max-w-[1100px]">
        <Outlet />
      </main>
    </div>
  );
}
