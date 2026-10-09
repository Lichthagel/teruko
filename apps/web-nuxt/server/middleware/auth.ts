import { protectRequest } from "server-graphql";

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const url = new URL(event.node.req.url ?? "/", `${protocol}://${headers.host ?? "localhost"}`);
  if (url.pathname === "/graphql" || url.pathname.startsWith("/auth/") || url.pathname.startsWith("/_nuxt/") || url.pathname.startsWith("/favicon"))
    return;

  const request = new Request(url, {
    method: event.node.req.method,
    headers: headers as HeadersInit,
  });
  const response = await protectRequest(request);
  if (!response)
    return;
  event.node.res.statusCode = response.status;
  response.headers.forEach((value, name) => event.node.res.setHeader(name, value));
  event.node.res.end(await response.text());
});
