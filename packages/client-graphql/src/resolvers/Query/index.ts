import { type Resolver } from "@urql/exchange-graphcache";

export default {
  image: (parent, { id }) => ({ __typename: "Image", id }),
  tag: (parent, { slug }) => ({ __typename: "Tag", slug }),
} satisfies { [key: string]: Resolver | void };
