import { useGraphQlJit } from "@envelop/graphql-jit";
import { useAPQ } from "@graphql-yoga/plugin-apq";
import { useResponseCache } from "@graphql-yoga/plugin-response-cache";
import {
  createYoga,
  YogaServerInstance,
  YogaServerOptions,
} from "graphql-yoga";

import schema from "./schema/index.js";

export const getYoga = (
  fetchAPI: YogaServerOptions<object, object>["fetchAPI"],
): YogaServerInstance<object, object> =>
  createYoga({
    schema,
    graphqlEndpoint: "/graphql",
    fetchAPI,
    plugins: [
      useGraphQlJit(),
      useResponseCache({
        session: () => null,
        idFields: ["id", "slug"],
        ttl: 30_000,
      }),
      useAPQ(),
    ],
    cors: {
      origin: "*",
    },
  });

export { default as schema } from "./schema/index.js";

export type { YogaServerInstance } from "graphql-yoga";
