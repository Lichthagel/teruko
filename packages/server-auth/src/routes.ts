import { authorizeRequest, getSession, isSameOriginRequest, requireUser, resetUserToken, startLogin, userTokenStatus } from "./auth.js";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

const redirectToIdentityProvider = (request: Request, returnTo: string) => {
  const url = new URL(request.url);
  url.searchParams.set("returnTo", returnTo);
  return startLogin(new Request(url, { method: "GET", headers: request.headers }));
};

export const userTokenHandler = async (request: Request): Promise<Response | null> => {
  const url = new URL(request.url);
  if (url.pathname !== "/api/settings/tokens")
    return null;

  const user = await requireUser(request);
  if (!user)
    return json({ error: "Unauthorized" }, 401);

  if (request.method === "GET") {
    return json(await userTokenStatus(user));
  }

  const origin = request.headers.get("origin");
  if (!origin || !isSameOriginRequest(request, origin))
    return json({ error: "Forbidden" }, 403);

  if (request.method === "POST")
    return json(await resetUserToken(user), 201);
  return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
};

export const protectAppRequest = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;
  if (path.startsWith("/auth/") || path === "/api/settings/tokens")
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
