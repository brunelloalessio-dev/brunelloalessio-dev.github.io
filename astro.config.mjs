import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://brunelloalessio-dev.github.io",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
