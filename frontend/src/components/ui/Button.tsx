import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#17699A] text-white shadow-[0_4px_14px_rgba(23,105,154,0.35)] hover:bg-[#0D2947] hover:shadow-[0_6px_18px_rgba(13,41,71,0.4)] hover:-translate-y-0.5",
  secondary:
    "bg-white text-[#17699A] border border-[#DCE6EF] hover:border-[#17699A] hover:shadow-[0_4px_14px_rgba(23,105,154,0.15)] hover:-translate-y-0.5",
  ghost: "bg-transparent text-[#0D2947] hover:bg-[#E8F1FA]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200";

export function ButtonLink({
  to,
  children,
  variant = "primary",
  className = "",
}: BaseProps & { to: string }) {
  return (
    <Link to={to} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled,
}: BaseProps & {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClasses[variant]} ${className} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
    >
      {children}
    </button>
  );
}
