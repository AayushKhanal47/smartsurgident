import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDealerOrders,
  loginDealer,
  logoutDealer,
  updateDealerOrderStatus,
} from "../../api/endpoints";
import type { DealerOrder } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";

const statuses: DealerOrder["status"][] = [
  "placed",
  "accepted_by_dealer",
  "dispatched",
  "delivered",
  "cancelled",
];

export default function DealerPortal() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<DealerOrder[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadOrders = async () => {
    const data = await getDealerOrders();
    setOrders(data);
    setSignedIn(true);
  };

  useEffect(() => {
    loadOrders().catch(() => setSignedIn(false)).finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginDealer(email, password);
      await loadOrders();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (id: string, status: DealerOrder["status"]) => {
    try {
      const updated = await updateDealerOrderStatus(id, status);
      setOrders((current) => current.map((order) => (order._id === id ? updated : order)));
    } catch {
      setError("Unable to update this order. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutDealer();
    } finally {
      setOrders([]);
      setSignedIn(false);
      navigate("/dealer/login", { replace: true });
    }
  };

  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-brand-muted">Loading...</div>;
  }

  if (!signedIn) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-brand-blue">Smart Surgident</p>
            <h1 className="text-xl font-semibold text-brand-navy mt-1">Dealer portal</h1>
            <p className="text-sm text-brand-slate mt-1">Sign in to manage orders routed to your city.</p>
          </div>
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          <PasswordInput required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting} className="justify-center">{submitting ? "Signing in..." : "Sign in"}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg px-4 py-7 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div><p className="text-sm font-medium text-brand-blue">Smart Surgident</p><h1 className="text-2xl font-semibold text-brand-navy">Routed orders</h1></div>
          <button onClick={handleLogout} className="text-sm text-red-600 font-medium">Log out</button>
        </div>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-brand-slate">No orders have been routed to you yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap justify-between gap-3 border-b border-slate-100 pb-4">
                  <div><h2 className="font-semibold text-brand-navy">{order.orderNumber}</h2><p className="text-sm text-brand-slate">{new Date(order.createdAt).toLocaleString()}</p></div>
                  <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value as DealerOrder["status"])} className="border border-slate-200 rounded-lg px-3 py-2 text-sm capitalize">
                    {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4 text-sm">
                  <div><p className="font-medium text-brand-navy">{order.customerName}</p><p className="text-brand-slate">{order.customerPhone}</p><p className="text-brand-slate mt-1">{order.shippingAddress}</p></div>
                  <div><ul className="space-y-1">{order.items.map((item, index) => <li key={`${item.name}-${index}`} className="text-brand-slate">{item.name} × {item.quantity} — Rs {(item.price * item.quantity).toLocaleString()}</li>)}</ul><p className="font-semibold text-brand-navy mt-3">Total: Rs {order.totalAmount.toLocaleString()}</p></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
