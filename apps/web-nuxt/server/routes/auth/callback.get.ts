import { finishLogin } from "server-auth/auth";

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const forwardedHost = headers["x-forwarded-host"];
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) ?? headers.host ?? "localhost";
  const request = new Request(new URL(event.node.req.url ?? "/auth/callback", `${protocol}://${host}`), { headers: headers as HeadersInit });
  const response = await finishLogin(request);
  const setCookies = response.headers.getSetCookie();
  response.headers.forEach((value, name) => {
    if (name.toLowerCase() !== "set-cookie")
      setResponseHeader(event, name, value);
  });
  if (setCookies.length)
    setResponseHeader(event, "Set-Cookie", setCookies);
  setResponseHeader(event, "Cache-Control", "no-store");
  if (response.headers.has("location"))
    return sendRedirect(event, response.headers.get("location")!, response.status);
  setResponseStatus(event, response.status);
  return response.text();
});
