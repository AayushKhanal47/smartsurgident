import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loginAdmin, logoutAdmin, getMe } from "../api/endpoints";
import type { AdminUser } from "../api/endpoints";

interface AdminAuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if there's already a valid admin session cookie
  useEffect(() => {
    getMe()
      .then((user) => {
        if (user.role === "admin") setAdmin(user);
      })
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginAdmin(email, password);
    if (user.role !== "admin") {
      throw new Error("This account does not have admin access");
    }
    setAdmin(user);
  };

  const logout = async () => {
    await logoutAdmin();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
