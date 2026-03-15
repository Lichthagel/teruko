import { Client, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

import resolvers from "./resolvers/index.js";

export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange({
      keys: {
        Image: data => data.id as string | null,
        Tag: data => data.slug as string | null,
        TagCategory: data => data.slug as string | null,
        TagRule: data => (data.id)?.toString() ?? null,
      },
      resolvers,
      updates: {
        Mutation: {
          deleteTagRule: (_result, args, cache, _info) => {
            cache.invalidate({
              __typename: "TagRule",
              id: args.id as number,
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});
