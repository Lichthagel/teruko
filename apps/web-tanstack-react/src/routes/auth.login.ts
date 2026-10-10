import { createFileRoute } from "@tanstack/react-router";
import { startLogin } from "server-auth/auth";

export const Route = createFileRoute("/auth/login")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => startLogin(request),
    },
  },
});
