import { createFileRoute } from "@tanstack/react-router";
import { userTokenHandler } from "server-graphql";

const handler = async ({ request }: { request: Request }) =>
  await userTokenHandler(request) ?? new Response("Not Found", { status: 404 });

export const Route = createFileRoute("/api/settings/tokens")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
