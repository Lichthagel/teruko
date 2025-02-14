import { type Resolver } from "@urql/exchange-graphcache";

export default {
  createdAt: (parent) => new Date(parent.createdAt as string),
  updatedAt: (parent) => new Date(parent.updatedAt as string),
} satisfies ({ [key: string]: Resolver | void });
