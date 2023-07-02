import { NuxtConfig } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
const config: NuxtConfig = defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss"],
  plugins: ["~/plugins/urql/index.ts"],
  components: [
    "~/components",
    { path: "~/components/Filters", prefix: "Filters" },
  ],
});

export default config;
