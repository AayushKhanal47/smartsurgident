import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { LanguageProvider } from "./context/LanguageContext";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AdminAuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
