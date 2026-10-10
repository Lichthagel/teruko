import { userTokenHandler } from "server-auth/routes";

export default defineEventHandler(async (event) => {
  const forwardedProto = event.node.req.headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const forwardedHost = event.node.req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) ?? event.node.req.headers.host ?? "localhost";
  const method = event.node.req.method ?? "GET";
  const requestHeaders = new Headers();
  for (const [name, value] of Object.entries(event.node.req.headers)) {
    if (typeof value !== "undefined")
      requestHeaders.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  const request = new Request(new URL(event.node.req.url ?? "/api/settings/tokens", `${protocol}://${host}`), {
    method,
    headers: requestHeaders,
  });
  const response = await userTokenHandler(request);
  if (!response) {
    setResponseStatus(event, 404);
    return { error: "Not Found" };
  }

  setResponseHeader(event, "Cache-Control", "no-store");
  setResponseStatus(event, response.status);
  response.headers.forEach((value, name) => setResponseHeader(event, name, value));
  if (response.status === 204) {
    return null;
  }
  return response.json();
});
