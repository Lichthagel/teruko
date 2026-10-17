import { createFileRoute } from "@tanstack/react-router";
import { getYoga, protectGraphqlRequest } from "server-graphql";

const yoga = getYoga({ Response });
export const Route = createFileRoute("/graphql")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const protectedResponse = await protectGraphqlRequest(request);
        if (protectedResponse)
          return protectedResponse;
        return yoga(request);
      },
      OPTIONS: async ({ request }: { request: Request }) => yoga(request),
      POST: async ({ request }: { request: Request }) => {
        const protectedResponse = await protectGraphqlRequest(request);
        if (protectedResponse)
          return protectedResponse;
        return yoga(request);
      },
    },
  },
});
