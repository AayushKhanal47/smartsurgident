import { useLanguage } from "../context/LanguageContext";
import { translations } from "./translations";
import type { TranslationKey } from "./translations";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => translations[key][language];

  return { t, language };
}
