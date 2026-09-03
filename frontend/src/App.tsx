import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Brands from "./pages/Brands";
import BrandDetail from "./pages/BrandDetail";
import CategoryLanding from "./pages/CategoryLanding";
import CampaignLanding from "./pages/CampaignLanding";

import CompanyAbout from "./pages/company/About";
import CompanyFacilities from "./pages/company/Facilities";
import CompanyNews from "./pages/company/News";
import CompanyEvents from "./pages/company/Events";
import CompanyCareers from "./pages/company/Careers";

import SupportContact from "./pages/support/Contact";
import SupportFAQ from "./pages/support/FAQ";
import SupportWarranty from "./pages/support/Warranty";
import SupportQuote from "./pages/support/Quote";

import Resources from "./pages/resources/Resources";
import ResourceDetail from "./pages/resources/ResourceDetail";

import Dealers from "./pages/dealers/Dealers";
import DealerDetail from "./pages/dealers/DealerDetail";
import DealerPortal from "./pages/dealers/DealerPortal";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import RequireAdmin from "./pages/admin/RequireAdmin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminDealers from "./pages/admin/AdminDealers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminResources from "./pages/admin/AdminResources";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminSettings from "./pages/admin/AdminSettings";

// Wraps the public-facing site with the shared Navbar/Footer chrome.
// The admin area intentionally does NOT use this — it has its own sidebar layout.
function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin area — own layout, no public Navbar/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/dealer/login" element={<DealerPortal />} />
      <Route path="/dealer" element={<DealerPortal />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="dealers" element={<AdminDealers />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Public site — shared Navbar/Footer chrome */}
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />

      <Route path="/products" element={<SiteLayout><Products /></SiteLayout>} />
      <Route path="/products/:slug" element={<SiteLayout><ProductDetail /></SiteLayout>} />
      <Route path="/categories/:slug" element={<SiteLayout><CategoryLanding /></SiteLayout>} />
      <Route path="/campaigns/:slug" element={<SiteLayout><CampaignLanding /></SiteLayout>} />

      <Route path="/brands" element={<SiteLayout><Brands /></SiteLayout>} />
      <Route path="/brands/:slug" element={<SiteLayout><BrandDetail /></SiteLayout>} />

      <Route path="/company/about" element={<SiteLayout><CompanyAbout /></SiteLayout>} />
      <Route path="/company/facilities" element={<SiteLayout><CompanyFacilities /></SiteLayout>} />
      <Route path="/company/news" element={<SiteLayout><CompanyNews /></SiteLayout>} />
      <Route path="/company/events" element={<SiteLayout><CompanyEvents /></SiteLayout>} />
      <Route path="/company/careers" element={<SiteLayout><CompanyCareers /></SiteLayout>} />

      <Route path="/support/contact" element={<SiteLayout><SupportContact /></SiteLayout>} />
      <Route path="/support/faq" element={<SiteLayout><SupportFAQ /></SiteLayout>} />
      <Route path="/support/warranty" element={<SiteLayout><SupportWarranty /></SiteLayout>} />
      <Route path="/support/quote" element={<SiteLayout><SupportQuote /></SiteLayout>} />

      <Route path="/resources" element={<SiteLayout><Resources /></SiteLayout>} />
      <Route path="/resources/:slug" element={<SiteLayout><ResourceDetail /></SiteLayout>} />

      <Route path="/dealers" element={<SiteLayout><Dealers /></SiteLayout>} />
      <Route path="/dealers/:slug" element={<SiteLayout><DealerDetail /></SiteLayout>} />

      <Route path="/cart" element={<SiteLayout><Cart /></SiteLayout>} />
      <Route path="/checkout" element={<SiteLayout><Checkout /></SiteLayout>} />
    </Routes>
  );
}

export default App;
