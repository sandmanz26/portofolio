import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import FloatStack from './FloatStack';
import Lightbox from './Lightbox';
import EditToolbar from '../admin/EditToolbar';
import EditPanel from '../admin/EditPanel';

// Pages whose hero starts on a plain paper background (no dark image
// behind the nav) use the solid nav variant from the very first frame.
const SOLID_NAV_PREFIXES = ['/room/', '/activity/'];

export default function Layout() {
  const location = useLocation();
  const solid = SOLID_NAV_PREFIXES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav solid={solid} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <FloatStack />
      <Lightbox />
      <EditToolbar />
      <EditPanel />
    </>
  );
}
