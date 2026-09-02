import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import Logo from "./ui/Logo";

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About us", to: "/company/about" },
      { label: "Facilities", to: "/company/facilities" },
      { label: "News", to: "/company/news" },
      { label: "Events", to: "/company/events" },
      { label: "Careers", to: "/company/careers" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "All products", to: "/products" },
      { label: "Brands", to: "/brands" },
      { label: "E-Library", to: "/resources" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact", to: "/support/contact" },
      { label: "FAQ", to: "/support/faq" },
      { label: "Warranty", to: "/support/warranty" },
      { label: "Request a quote", to: "/support/quote" },
    ],
  },
  {
    heading: "Network",
    links: [
      { label: "Dealer network", to: "/dealers" },
      { label: "Become a dealer", to: "/support/contact" },
      { label: "Dealer login", to: "/dealer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-footer text-white/75 mt-20">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-12">
        <div className="col-span-2">
          <Logo theme="light" />
          <p className="text-sm mt-4 max-w-xs leading-relaxed">
            Genuine dental and surgical equipment, distributed and supported across
            Nepal through a growing dealer network.
          </p>
          <div className="flex flex-col gap-2 mt-5 text-sm">
            <span className="flex items-center gap-2">
              <HiOutlineLocationMarker className="shrink-0 text-brand-light" aria-hidden="true" /> Kathmandu, Nepal
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineMail className="shrink-0 text-brand-light" aria-hidden="true" /> info@smartsurgident.com
            </span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-display font-semibold text-sm text-white mb-4">{col.heading}</p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/55">
          <p>&copy; {new Date().getFullYear()} Smart Surgident Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/support/faq" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/support/faq" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
