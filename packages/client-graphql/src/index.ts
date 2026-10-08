import { Client, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

import resolvers from "./resolvers/index.js";

export const createUrqlOptions = (url: string, options: { fetch?: typeof fetch } = {}) => ({
  url,
  ...(options.fetch ? { fetch: options.fetch } : {}),
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

export const createUrqlClient = (url: string, options: { fetch?: typeof fetch } = {}) => new Client(createUrqlOptions(url, options));

export const urqlClient = createUrqlClient("/graphql");
