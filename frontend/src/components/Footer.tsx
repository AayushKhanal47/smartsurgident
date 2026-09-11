import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import Logo from "./ui/Logo";
import { useTranslation } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n/translations";
import { ADMIN_WHATSAPP_NUMBER, buildWhatsAppLink } from "../config/whatsapp";

const COLUMNS: { headingKey: TranslationKey; links: { labelKey: TranslationKey; to: string }[] }[] = [
  {
    headingKey: "footer.company",
    links: [
      { labelKey: "footer.aboutUs", to: "/company/about" },
      { labelKey: "footer.facilities", to: "/company/facilities" },
      { labelKey: "footer.news", to: "/company/news" },
      { labelKey: "footer.events", to: "/company/events" },
      { labelKey: "footer.careers", to: "/company/careers" },
    ],
  },
  {
    headingKey: "footer.products",
    links: [
      { labelKey: "footer.allProducts", to: "/products" },
      { labelKey: "footer.brands", to: "/brands" },
      { labelKey: "footer.elibrary", to: "/resources" },
    ],
  },
  {
    headingKey: "footer.support",
    links: [
      { labelKey: "footer.contact", to: "/support/contact" },
      { labelKey: "footer.faq", to: "/support/faq" },
      { labelKey: "footer.warranty", to: "/support/warranty" },
      { labelKey: "footer.requestQuote", to: "/support/quote" },
    ],
  },
  {
    headingKey: "footer.network",
    links: [
      { labelKey: "footer.dealerNetwork", to: "/dealers" },
      { labelKey: "footer.becomeDealer", to: "/support/contact" },
      { labelKey: "footer.dealerLogin", to: "/dealer" },
    ],
  },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-footer text-white/75">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-12">
        <div className="col-span-2">
          <Logo theme="light" />
          <p className="text-sm mt-4 max-w-xs leading-relaxed">{t("footer.tagline")}</p>
          <div className="flex flex-col gap-2 mt-5 text-sm">
            <span className="flex items-center gap-2">
              <HiOutlineLocationMarker className="shrink-0 text-brand-light" aria-hidden="true" /> {t("footer.address")}
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineMail className="shrink-0 text-brand-light" aria-hidden="true" /> info@smartsurgident.com
            </span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.headingKey}>
            <p className="font-display font-semibold text-sm text-white mb-4">{t(col.headingKey)}</p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.labelKey}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/55">
          <p>&copy; {new Date().getFullYear()} Smart Surgident Pvt. Ltd. {t("footer.rights")}</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/support/faq" className="hover:text-white transition-colors">{t("footer.privacyPolicy")}</Link>
            <Link to="/support/faq" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
            <a
              href={buildWhatsAppLink(
                ADMIN_WHATSAPP_NUMBER,
                "Hi, I saw the Smart Surgident website and I'm interested in building one like this."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Want a website like this? Let's talk.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
