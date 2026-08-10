import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="px-6 md:px-10 py-16 text-center">
        <p className="text-slate-400 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-brand-blue font-medium">
          Browse the catalog →
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-brand-navy mb-6">Your cart</h1>

      <div className="bg-white rounded-2xl divide-y divide-slate-100">
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-brand-navy">{product.name}</p>
              <p className="text-xs text-slate-400">Qty: {quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-brand-blue">
                Rs {(product.price * quantity).toLocaleString()}
              </p>
              <button
                onClick={() => removeFromCart(product._id)}
                className="text-xs text-slate-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="font-semibold text-brand-navy">Total: Rs {total.toLocaleString()}</p>
        <Link
          to="/checkout"
          className="bg-brand-blue text-white px-6 py-3 rounded-full font-medium"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
