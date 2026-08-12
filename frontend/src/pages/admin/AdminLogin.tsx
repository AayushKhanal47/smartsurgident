import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Button } from "../../components/ui/Button";
import Logo from "../../components/ui/Logo";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
          ? err.message
          : undefined;
      setError(message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h1 className="text-lg font-semibold text-brand-navy text-center mb-2">Admin login</h1>
          <input
            required
            type="email"
            placeholder="Email"
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting} className="justify-center">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
