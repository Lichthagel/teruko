import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ["@urql/svelte"],
  },
  css: {
    postcss: "client-css/postcss",
  },
});
