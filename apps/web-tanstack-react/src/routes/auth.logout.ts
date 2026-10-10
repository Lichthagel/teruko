import { createFileRoute } from "@tanstack/react-router";
import { logout } from "server-auth/auth";

export const Route = createFileRoute("/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) =>
        logout(request),
    },
  },
});
