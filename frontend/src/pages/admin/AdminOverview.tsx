import { Link } from "react-router-dom";
import {
  HiOutlineCube,
  HiOutlineViewGrid,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineSpeakerphone,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
} from "react-icons/hi";

const CARDS = [
  { to: "/admin/products", icon: HiOutlineCube, title: "Products", description: "Add, view, or remove catalog items" },
  { to: "/admin/categories", icon: HiOutlineViewGrid, title: "Categories", description: "Organize products into categories" },
  { to: "/admin/brands", icon: HiOutlineTag, title: "Brands", description: "Manage the brands you carry" },
  { to: "/admin/dealers", icon: HiOutlineUserGroup, title: "Dealers", description: "Onboard and manage sub-dealers" },
  { to: "/admin/campaigns", icon: HiOutlineSpeakerphone, title: "Campaigns", description: "Run promotions and featured pushes" },
  { to: "/admin/resources", icon: HiOutlineBookOpen, title: "E-Library", description: "Publish articles, guides and catalogs" },
  { to: "/admin/quotes", icon: HiOutlineClipboardList, title: "Quote requests", description: "Review and respond to B2B inquiries" },
];

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-navy mb-1">Welcome back</h1>
      <p className="text-sm text-brand-muted mb-8">Choose what you'd like to manage.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-brand-blue transition-all"
          >
            <card.icon className="text-2xl text-brand-blue mb-3" aria-hidden="true" />
            <p className="font-semibold text-brand-navy mb-1">{card.title}</p>
            <p className="text-sm text-brand-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
