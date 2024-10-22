import { useGraphQlJit } from "@envelop/graphql-jit";
import { useAPQ } from "@graphql-yoga/plugin-apq";
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
    plugins: [useGraphQlJit(), useAPQ()],
    cors: {
      origin: "*",
    },
  });

export { default as schema } from "./schema/index.js";

export type { YogaServerInstance } from "graphql-yoga";
