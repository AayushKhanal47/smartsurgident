import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

interface LogoProps {
  variant?: "full" | "mark"; // full = icon + wordmark, mark = icon only (mobile/favicon contexts)
  theme?: "light" | "dark"; // light = for dark backgrounds (navbar/footer), dark = for light backgrounds
  className?: string;
}

// Central place for logo spacing/sizing rules so it's never re-hardcoded per page.
export default function Logo({ variant = "full", theme = "dark", className = "" }: LogoProps) {
  const textColor = theme === "light" ? "text-white" : "text-brand-navy";

  return (
    <Link to="/" className={`flex items-center gap-2.5 shrink-0 ${className}`} aria-label="Smart Surgident — home">
      <img src={logo} alt="Smart Surgident" className="h-9 w-9 object-contain" />
      {variant === "full" && (
        <span className={`font-display font-bold text-lg leading-tight ${textColor}`}>
          Smart Surgident
        </span>
      )}
    </Link>
  );
}
