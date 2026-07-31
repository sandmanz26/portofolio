import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { ContentProvider } from "../context/ContentContext.jsx";
import { CartProvider } from "../context/CartContext.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ContentProvider>
      <CartProvider>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </CartProvider>
    </ContentProvider>
  );
}
