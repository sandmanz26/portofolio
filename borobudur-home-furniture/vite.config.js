import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/" assumes the build is deployed at the root of a domain or
// subdomain (e.g. https://borobudurhomefurniture.com/) on cPanel — the
// common case. If it will instead live in a subfolder (e.g.
// https://example.com/bhf/), change this to "/bhf/" and update the
// .htaccess RewriteBase in public/.htaccess to match. A relative
// base ("./") is NOT safe here because React Router uses real URLs
// (e.g. /product/rama-dining-table): a relative base resolves asset
// paths against that URL and 404s on refresh or a direct link.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
