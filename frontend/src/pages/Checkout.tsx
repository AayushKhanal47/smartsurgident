import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCities, createOrder } from "../api/endpoints";
import type { City } from "../api/endpoints";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, clearCart, total } = useCart();
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    cityId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCities().then(setCities).catch(() => setCities([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // This is the step that triggers city → dealer routing on the backend
      await createOrder({
        ...form,
        items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
      });
      clearCart();
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong placing the order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <input
          required
          placeholder="Full name"
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />
        <input
          required
          placeholder="Phone number"
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email (optional)"
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
        />
        <textarea
          required
          placeholder="Delivery address"
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          value={form.shippingAddress}
          onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
        />
        <select
          required
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          value={form.cityId}
          onChange={(e) => setForm({ ...form, cityId: e.target.value })}
        >
          <option value="">Select your city (routes to that city's dealer)</option>
          {cities.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-brand-navy">Total: Rs {total.toLocaleString()}</p>
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-blue text-white px-6 py-3 rounded-full font-medium disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
