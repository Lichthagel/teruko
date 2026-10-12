import { Client, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

import resolvers from "./resolvers/index.js";

export const createUrqlOptions = (url: string) => ({
  url,
  exchanges: [
    cacheExchange({
      keys: {
        Image: data => data.id as string | null,
        Tag: data => data.slug as string | null,
        TagCategory: data => data.slug as string | null,
      },
      resolvers,
    }),
    fetchExchange,
  ],
});

export const createUrqlClient = (url: string) => new Client(createUrqlOptions(url));

export const urqlClient = createUrqlClient("/graphql");
