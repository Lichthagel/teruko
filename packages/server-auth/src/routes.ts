import { authorizeRequest, getSession, startLogin } from "./auth.js";

const redirectToIdentityProvider = (request: Request, returnTo: string) => {
  const url = new URL(request.url);
  url.searchParams.set("returnTo", returnTo);
  return startLogin(new Request(url, { method: "GET", headers: request.headers }));
};

export const protectAppRequest = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;
  if (path.startsWith("/auth/"))
    return null;
  if (path === "/login" && request.method === "GET") {
    if (await getSession(request))
      return Response.redirect(new URL("/", request.url), 302);
    return redirectToIdentityProvider(request, requestUrl.searchParams.get("returnTo") ?? "/");
  }
  if (path.startsWith("/assets/") || path.startsWith("/_nuxt/") || path.startsWith("/_build/") || path.startsWith("/_app/") || path.startsWith("/favicon") || /^\/[^/]+\.(?:css|js|mjs|map|woff2?|ttf|svg|png|ico)$/.test(path))
    return null;
  if (path.startsWith("/img/") || /^\/\d+(?:\/|$)/.test(path)) {
    const user = await authorizeRequest(request);
    if (user)
      return null;
    if (/^\/\d+\/[^/]+$/.test(path))
      return new Response("Unauthorized", { status: 401 });
    return redirectToIdentityProvider(request, `${path}${requestUrl.search}`);
  }
  const user = await authorizeRequest(request);
  if (user)
    return null;
  if (request.method === "GET" || request.method === "HEAD") {
    return redirectToIdentityProvider(request, `${path}${requestUrl.search}`);
  }
  return new Response("Unauthorized", { status: 401 });
};
