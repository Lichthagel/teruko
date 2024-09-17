import type { NuxtConfig } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
const config: NuxtConfig = defineNuxtConfig({
  compatibilityDate: "2024-09-17",
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0",
  },
  modules: ["@nuxtjs/tailwindcss"],
  plugins: ["~/plugins/urql/index.ts"],
  components: ["~/components", { path: "~/components/Filters", prefix: "Filters" }],
  telemetry: false,
});

export default config;
