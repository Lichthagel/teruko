import { createFileRoute } from "@tanstack/react-router";
import { userTokenHandler } from "server-auth/routes";

const handler = async ({ request }: { request: Request }) => {
  const response = await userTokenHandler(request);
  return response ?? new Response("Not Found", { status: 404 });
};

export const Route = createFileRoute("/api/settings/tokens")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
