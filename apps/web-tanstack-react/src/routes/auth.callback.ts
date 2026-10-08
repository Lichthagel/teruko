import { createFileRoute } from "@tanstack/react-router";
import { finishLogin } from "server-graphql";

export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => finishLogin(request),
    },
  },
});
