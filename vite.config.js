import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      "@utils": "/src/utils",
      "@context": "/src/context",
      "@portal": "/src/portals",
      "@i18n": "/src/i18n",
      "@model": "/src/model",
      "@app": "/src/components/app",
      "@ui": "/src/components/ui",
    },
  },
});
