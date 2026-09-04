import { useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

// ---------------------------------------------------------------------------
// Shared admin UI primitives. One consistent visual language for every
// dashboard screen — replaces the ~50 repeated inline input class strings.
// ---------------------------------------------------------------------------

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-navy">{title}</h1>
        {subtitle && <p className="text-sm text-brand-slate mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-brand-border ${className}`}>{children}</div>
  );
}

const fieldBase =
  "w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition";

export function Field({
  label,
  hint,
  className = "",
  type,
  ...props
}: { label?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-medium text-brand-slate">{label}</span>}
      <div className="relative">
        <input
          type={isPassword ? (visible ? "text" : "password") : type}
          className={`${fieldBase} ${isPassword ? "pr-10" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy cursor-pointer"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <HiEyeOff /> : <HiEye />}
          </button>
        )}
      </div>
      {hint && <span className="text-[11px] text-brand-muted">{hint}</span>}
    </label>
  );
}

export function Textarea({
  label,
  className = "",
  ...props
}: { label?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-medium text-brand-slate">{label}</span>}
      <textarea className={`${fieldBase} resize-y`} {...props} />
    </label>
  );
}

export function Select({
  label,
  children,
  className = "",
  ...props
}: { label?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-medium text-brand-slate">{label}</span>}
      <select className={fieldBase} {...props}>
        {children}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 text-sm text-brand-navy"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-brand-primary" : "bg-brand-border"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "accent" | "warn";
}) {
  const toneClass =
    tone === "accent"
      ? "border-brand-primary/30 bg-brand-tint/40"
      : tone === "warn"
      ? "border-amber-300 bg-amber-50"
      : "border-brand-border bg-white";
  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-brand-muted">{label}</p>
      <p className="font-display text-3xl font-bold text-brand-navy mt-2 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-brand-slate mt-1">{hint}</p>}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "amber" | "slate" }) {
  const cls = {
    default: "bg-brand-tint text-brand-primary",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="p-8 text-center text-sm text-brand-muted">{children}</p>;
}

export function DangerButton({ onClick, children = "Delete" }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
    >
      {children}
    </button>
  );
}
