import { Client, fetchExchange } from "@urql/core";

import { cacheExchange } from "@urql/exchange-graphcache";
import keys from "./keys.js";
import resolvers from "./resolvers/index.js";
import updates from "./updates/index.js";

export const createUrqlOptions = (url: string) => ({
  url,
  exchanges: [
    cacheExchange({
      keys,
      resolvers,
      updates,
    }),
    fetchExchange,
  ],
});

export const createUrqlClient = (url: string) => new Client(createUrqlOptions(url));

export const urqlClient = createUrqlClient("/graphql");
