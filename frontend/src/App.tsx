import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";
import OrganizationSchema from "./components/OrganizationSchema";

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

// Admin panel and the dealer portal are only ever used by a small,
// authenticated group of people — not the public visitors this site is
// optimized for — but every one of these was previously imported eagerly,
// so a first-time homepage visitor downloaded and parsed all of it before
// seeing anything (perf audit, P1). Lazy-loaded so their code only
// downloads when someone actually navigates to /admin or /dealer.
const DealerPortal = lazy(() => import("./pages/dealers/DealerPortal"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const RequireAdmin = lazy(() => import("./pages/admin/RequireAdmin"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const AdminDealers = lazy(() => import("./pages/admin/AdminDealers"));
const AdminCampaigns = lazy(() => import("./pages/admin/AdminCampaigns"));
const AdminResources = lazy(() => import("./pages/admin/AdminResources"));
const AdminQuotes = lazy(() => import("./pages/admin/AdminQuotes"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers"));
const AdminFaq = lazy(() => import("./pages/admin/AdminFaq"));

// Wraps the public-facing site with the shared Navbar/Footer chrome.
// The admin area intentionally does NOT use this — it has its own sidebar layout.
function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <OrganizationSchema />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
    </div>
  );
}

// Only ever shown while a lazy-loaded chunk (admin/dealer) is downloading —
// public routes above never suspend, so they never see this.
function RouteLoadingFallback() {
  return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Loading…</p>;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="faq" element={<AdminFaq />} />
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
      </Suspense>
    </>
  );
}

export default App;
