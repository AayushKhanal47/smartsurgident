import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories/:slug" element={<CategoryLanding />} />
          <Route path="/campaigns/:slug" element={<CampaignLanding />} />

          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:slug" element={<BrandDetail />} />

          <Route path="/company/about" element={<CompanyAbout />} />
          <Route path="/company/facilities" element={<CompanyFacilities />} />
          <Route path="/company/news" element={<CompanyNews />} />
          <Route path="/company/events" element={<CompanyEvents />} />
          <Route path="/company/careers" element={<CompanyCareers />} />

          <Route path="/support/contact" element={<SupportContact />} />
          <Route path="/support/faq" element={<SupportFAQ />} />
          <Route path="/support/warranty" element={<SupportWarranty />} />
          <Route path="/support/quote" element={<SupportQuote />} />

          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />

          <Route path="/dealers" element={<Dealers />} />
          <Route path="/dealers/:slug" element={<DealerDetail />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
