import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-brand-muted">Loading...</div>;
  }
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
