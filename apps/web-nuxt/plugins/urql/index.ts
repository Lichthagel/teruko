import urql from "@urql/vue";
import { urqlClient } from "client-common";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(urql, urqlClient);
});
