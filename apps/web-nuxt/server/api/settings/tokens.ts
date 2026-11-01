import { isSameOriginRequest, requireSessionUser, resetUserToken, userTokenStatus } from "server-auth/auth";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method ?? "GET";
  const forwardedProto = event.node.req.headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto) === "https"
    ? "https"
    : "http";
  const forwardedHost = event.node.req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost) ?? event.node.req.headers.host ?? "localhost";
  const requestHeaders = new Headers();
  for (const [name, value] of Object.entries(event.node.req.headers)) {
    if (typeof value !== "undefined") {
      requestHeaders.set(name, Array.isArray(value)
        ? value.join(", ")
        : value);
    }
  }
  const request = new Request(new URL(event.node.req.url ?? "/api/settings/tokens", `${protocol}://${host}`), {
    method,
    headers: requestHeaders,
  });
  const user = await requireSessionUser(request);
  if (!user) {
    setResponseHeader(event, "Cache-Control", "no-store");
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }

  if (method === "GET") {
    setResponseHeader(event, "Cache-Control", "no-store");
    return userTokenStatus(user);
  }

  const origin = request.headers.get("origin");
  if (!origin || !isSameOriginRequest(request, origin)) {
    setResponseHeader(event, "Cache-Control", "no-store");
    setResponseStatus(event, 403);
    return { error: "Forbidden" };
  }
  if (method === "POST") {
    setResponseHeader(event, "Cache-Control", "no-store");
    return resetUserToken(user);
  }

  setResponseHeader(event, "Allow", "GET, POST");
  setResponseStatus(event, 405);
  return { error: "Method Not Allowed" };
});
