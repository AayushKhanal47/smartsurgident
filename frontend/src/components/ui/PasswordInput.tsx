import { useState, type InputHTMLAttributes } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

// A plain <input type="password"> plus a show/hide eye toggle. Use this (or
// admin/ui.tsx's <Field type="password">) for any password input on the
// site instead of a raw <input type="password">.
export default function PasswordInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input type={visible ? "text" : "password"} className={`${className} pr-9`} {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy cursor-pointer"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <HiEyeOff /> : <HiEye />}
      </button>
    </div>
  );
}
