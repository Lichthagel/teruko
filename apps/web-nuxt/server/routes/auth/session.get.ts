import { requireSessionUser } from "server-auth/auth";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto) === "https"
    ? "https"
    : "http";
  const forwardedHost = headers["x-forwarded-host"];
  const host = (Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost) ?? headers.host ?? "localhost";
  const request = new Request(new URL(event.node.req.url ?? "/auth/session", `${protocol}://${host}`), {
    method: "GET",
    headers: headers as HeadersInit,
  });

  if (!await requireSessionUser(request)) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }

  return { authenticated: true };
});
