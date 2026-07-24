import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminProductEditor from "./pages/admin/AdminProductEditor.jsx";
import AdminContent from "./pages/admin/AdminContent.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminProducts />} />
        <Route path="products/:id" element={<AdminProductEditor />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
    </Routes>
  );
}
