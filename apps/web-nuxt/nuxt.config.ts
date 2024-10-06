import type { NuxtConfig } from "nuxt/schema";

import postcssConfig from "client-css/postcss.config.mjs";

// https://nuxt.com/docs/api/configuration/nuxt-config
const config: NuxtConfig = defineNuxtConfig({
  compatibilityDate: "2024-09-17",
  css: ["client-css/global.scss"],
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0",
  },
  modules: [],
  plugins: ["~/plugins/urql/index.ts"],
  postcss: {
    plugins: postcssConfig.plugins as Record<string, unknown>,
  },
  components: ["~/components", { path: "~/components/Filters", prefix: "Filters" }],
  telemetry: false,
});

export default config;
