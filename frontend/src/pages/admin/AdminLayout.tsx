import { NavLink, Outlet, useNavigate } from "react-router-dom";
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

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-brand-bg">
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-100">
          <Logo />
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
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
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
