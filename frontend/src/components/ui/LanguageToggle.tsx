import { useLanguage } from "../../context/LanguageContext";

// EN/NP switch — toggles static site copy between English and Nepali.
// Product/brand/catalogue data from the database stays in whatever
// language it was entered in (no Nepali field exists on those records).
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "en" ? "Switch to Nepali" : "अंग्रेजीमा बदल्नुहोस्"}
      className={`inline-flex items-center rounded-full border border-brand-border bg-white p-0.5 text-xs font-semibold ${className}`}
    >
      <span
        className={`px-2 py-1 rounded-full transition-colors ${
          language === "en" ? "bg-brand-primary text-white" : "text-brand-muted"
        }`}
      >
        EN
      </span>
      <span
        className={`px-2 py-1 rounded-full transition-colors ${
          language === "np" ? "bg-brand-primary text-white" : "text-brand-muted"
        }`}
      >
        नेप
      </span>
    </button>
  );
}
