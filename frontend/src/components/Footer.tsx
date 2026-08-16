import { Link } from "react-router-dom";
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
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
      { label: "Categories", to: "/products" },
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
    heading: "Resources",
    links: [
      { label: "E-Library", to: "/resources" },
      { label: "Dealer network", to: "/dealers" },
      { label: "Become a dealer", to: "/support/contact" },
    ],
  },
];

// Placeholder — replace with your real WhatsApp business number once set up
const WHATSAPP_NUMBER = "977980XXXXXXX";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white mt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-6 gap-10">
        <div className="col-span-2">
          <Logo theme="light" />
          <p className="text-slate-300 text-sm mt-4 max-w-xs">
            Genuine dental and surgical instruments, imported and distributed across Nepal
            through a nationwide dealer network.
          </p>
          <div className="flex flex-col gap-2 mt-5 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <HiOutlineLocationMarker className="shrink-0" aria-hidden="true" /> Kathmandu, Nepal
            </span>
            <span className="flex items-center gap-2">
              <HiOutlinePhone className="shrink-0" aria-hidden="true" /> 01-4XXXXXX
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineMail className="shrink-0" aria-hidden="true" /> info@smartsurgident.com
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <FaWhatsapp className="shrink-0" aria-hidden="true" /> WhatsApp us
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-semibold text-sm mb-4">{col.heading}</p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-300 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-400">
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