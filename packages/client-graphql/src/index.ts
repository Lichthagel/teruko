import { Client, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

import resolvers from "./resolvers";

export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange({
      keys: {
        Image: (data) => data.id as string | null,
        Tag: (data) => data.slug as string | null,
        TagCategory: (data) => data.slug as string | null,
      },
      resolvers,
    }),
    fetchExchange,
  ],
});
