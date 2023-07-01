import { Client, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange({
      keys: {
        Image: (data) => data.id as string | null,
        Tag: (data) => data.slug as string | null,
        TagCategory: (data) => data.slug as string | null,
      },
      resolvers: {
        Query: {
          image: (parent, { id }) => ({ __typename: "Image", id }),
        },
        Image: {
          createdAt: (parent) => new Date(parent.createdAt as string),
          updatedAt: (parent) => new Date(parent.updatedAt as string),
        },
      },
    }),
    fetchExchange,
  ],
});
