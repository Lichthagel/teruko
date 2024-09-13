import { Resolver } from "@urql/exchange-graphcache";

export default {
  image: (parent, { id }) => ({ __typename: "Image", id }),
  tag: (parent, { slug }) => ({ __typename: "Tag", slug }),
} satisfies Record<string, Resolver | void>;
