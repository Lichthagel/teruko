import { logout } from "server-graphql";

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const forwardedHost = headers["x-forwarded-host"];
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) ?? headers.host ?? "localhost";
  const request = new Request(new URL(event.node.req.url ?? "/auth/logout", `${protocol}://${host}`), {
    method: "POST",
    headers: headers as HeadersInit,
  });
  const response = await logout(request);
  const setCookies = response.headers.getSetCookie();
  if (setCookies.length)
    setResponseHeader(event, "Set-Cookie", setCookies);
  setResponseHeader(event, "Cache-Control", "no-store");
  return sendRedirect(event, response.headers.get("location") ?? "/login", response.status);
});
