import urql from "@urql/vue";
import { urqlClient } from "client-graphql";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(urql, urqlClient);
});
