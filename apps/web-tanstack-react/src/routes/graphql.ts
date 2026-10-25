import { createFileRoute } from "@tanstack/react-router";
import { getYoga } from "server-graphql";

const yogaApp = getYoga({ Response });

const handleGraphQLRequest = ({ request }: { request: Request }) => {
  // Normalize srvx's lazy Request before Yoga's body limiter wraps its stream.
  const body = request.body;
  const yogaRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    signal: request.signal,
    ...(body
      ? { body, duplex: "half" as const }
      : {}),
  } as RequestInit & { duplex?: "half" });

  return yogaApp(yogaRequest);
};

export const Route = createFileRoute("/graphql")({
  server: {
    handlers: {
      GET: handleGraphQLRequest,
      OPTIONS: handleGraphQLRequest,
      POST: handleGraphQLRequest,
    },
  },
});
