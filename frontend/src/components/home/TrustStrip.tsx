import { useTranslation } from "../../i18n/useTranslation";
import type { TranslationKey } from "../../i18n/translations";

const TRUST_KEYS: TranslationKey[] = [
  "trust.nationwideDelivery",
  "trust.genuineProducts",
  "trust.expertSupport",
  "trust.dealerNetwork",
];

// Thin credibility line under the hero — verified service capabilities, no
// cards, no icons, no invented counts. One quiet rule top and bottom.
export default function TrustStrip() {
  const { t } = useTranslation();

  return (
    <div className="border-y border-brand-border bg-white">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
        {TRUST_KEYS.map((key, i) => (
          <span key={key} className="flex items-center gap-3 text-[13px] text-brand-slate">
            {i > 0 && <span className="text-brand-border" aria-hidden="true">|</span>}
            {t(key)}
          </span>
        ))}
      </div>
    </div>
  );
}
