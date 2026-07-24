import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { ContentProvider } from "../context/ContentContext.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ContentProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </ContentProvider>
  );
}
