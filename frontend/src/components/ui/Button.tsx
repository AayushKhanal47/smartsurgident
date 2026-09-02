import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark" | "outlineDark";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary text-white hover:bg-brand-primary-hover",
  secondary:
    "bg-white text-brand-navy border border-brand-border hover:border-brand-primary hover:text-brand-primary",
  ghost: "bg-transparent text-brand-navy hover:bg-brand-tint",
  onDark: "bg-white text-brand-primary hover:bg-brand-bg",
  outlineDark: "bg-transparent text-white border border-white/25 hover:bg-white/10",
};

// 44px min height = comfortable touch target.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 min-h-11 py-2.5 text-sm font-medium tracking-[0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

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
      className={`${base} ${variantClasses[variant]} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
