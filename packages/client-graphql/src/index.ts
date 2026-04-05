import { Client, fetchExchange } from "@urql/core";

import { cacheExchange } from "@urql/exchange-graphcache";
import keys from "./keys.js";
import resolvers from "./resolvers/index.js";
import updates from "./updates/index.js";

export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange({
      keys,
      resolvers,
      updates,
    }),
    fetchExchange,
  ],
});
