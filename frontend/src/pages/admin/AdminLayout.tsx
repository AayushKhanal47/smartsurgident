import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Logo from "../../components/ui/Logo";

const LINKS = [
  { label: "Products", to: "/admin/products" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Brands", to: "/admin/brands" },
  { label: "Dealers", to: "/admin/dealers" },
  { label: "Campaigns", to: "/admin/campaigns" },
  { label: "Resources", to: "/admin/resources" },
  { label: "Quote requests", to: "/admin/quotes" },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = (
    <>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-brand-tint text-brand-blue" : "text-brand-navy hover:bg-brand-tint"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-brand-muted mb-2">{admin?.name}</p>
        <button onClick={handleLogout} className="text-xs text-red-500 font-medium">
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-brand-bg">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4">
        <Logo />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-brand-navy text-2xl"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute top-14 left-0 bottom-0 w-64 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-slate-100 flex-col shrink-0">
        <div className="p-5 border-b border-slate-100">
          <Logo />
        </div>
        {SidebarContent}
      </aside>

      <main className="flex-1 p-5 pt-20 lg:p-8 lg:pt-8 overflow-y-auto overflow-x-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
