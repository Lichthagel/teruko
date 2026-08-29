import type { NuxtApp } from "nuxt/app";

import urql from "@urql/vue";
import { createUrqlOptions } from "client-graphql";

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  nuxtApp.vueApp.use(urql, createUrqlOptions("/graphql"));
});
