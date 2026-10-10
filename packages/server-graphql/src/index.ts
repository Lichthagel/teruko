import type { YogaServerInstance, YogaServerOptions } from "graphql-yoga";
import { useGraphQlJit } from "@envelop/graphql-jit";
import { useAPQ } from "@graphql-yoga/plugin-apq";
import { createYoga } from "graphql-yoga";

import schema from "./schema/index.js";

export const getYoga = (
  fetchAPI: YogaServerOptions<object, object>["fetchAPI"],
): YogaServerInstance<object, object> =>
  createYoga({
    schema,
    graphqlEndpoint: "/graphql",
    fetchAPI,
    plugins: [useGraphQlJit(), useAPQ()],
    cors: {
      origin: "https://www.pixiv.net",
      allowedHeaders: ["Authorization", "Content-Type", "Apollo-Require-Preflight"],
      methods: ["GET", "POST", "OPTIONS"],
    },
  });

export * from "./routes.js";
export { default as schema } from "./schema/index.js";

export type { YogaServerInstance } from "graphql-yoga";
