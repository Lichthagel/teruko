import { authorizeRequest, createUserToken, protectRequest, revokeUserToken } from "server-graphql";

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const url = new URL(event.node.req.url ?? "/", `${protocol}://${headers.host ?? "localhost"}`);
  if (url.pathname === "/settings/tokens" && event.node.req.method !== "GET") {
    const method = event.node.req.method ?? "POST";
    const request = new Request(url, { method, headers: headers as HeadersInit, body: (await readRawBody(event)) ?? "" });
    const user = await authorizeRequest(request);
    let response: Response;
    if (!user) {
      response = Response.json({ error: "Unauthorized" }, { status: 401 });
    } else if (!request.headers.get("origin") || request.headers.get("origin") !== url.origin) {
      response = Response.json({ error: "Forbidden" }, { status: 403 });
    } else if (method === "POST") {
      response = Response.json(await createUserToken(user), { status: 201, headers: { "Cache-Control": "no-store" } });
    } else if (method === "DELETE") {
      const tokenId = url.searchParams.get("id");
      if (!tokenId) {
        response = Response.json({ error: "Token id required" }, { status: 400 });
      } else {
        await revokeUserToken(user, tokenId);
        response = new Response(null, { status: 204 });
      }
    } else {
      response = new Response(null, { status: 405 });
    }
    event.node.res.statusCode = response.status;
    response.headers.forEach((value, name) => event.node.res.setHeader(name, value));
    event.node.res.end(await response.text());
    return;
  }
  if (url.pathname === "/graphql" || url.pathname.startsWith("/auth/") || (url.pathname === "/settings/tokens" && event.node.req.method === "GET") || url.pathname.startsWith("/_nuxt/") || url.pathname.startsWith("/favicon"))
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
