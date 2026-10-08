import { authHandler } from "server-graphql";

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const host = headers.host ?? "localhost";
  const method = event.node.req.method ?? "GET";
  const body = ["GET", "HEAD"].includes(method) ? undefined : await readRawBody(event);
  const request = new Request(new URL(event.node.req.url ?? "/", `${protocol}://${host}`), {
    method,
    headers: headers as HeadersInit,
    body,
  });
  const response = await authHandler(request);
  if (!response) {
    event.node.res.statusCode = 404;
    event.node.res.end("Not Found");
    return;
  }
  event.node.res.statusCode = response.status;
  const setCookies = response.headers.getSetCookie();
  response.headers.forEach((value, name) => {
    if (name.toLowerCase() !== "set-cookie")
      event.node.res.setHeader(name, value);
  });
  if (setCookies.length)
    event.node.res.setHeader("Set-Cookie", setCookies);
  event.node.res.end(await response.text());
});
