import { authorizeRequest, createUserToken, finishLogin, logout, requireGraphqlUser, requireUser, revokeUserToken, startLogin } from "./auth.js";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

export const authHandler = async (request: Request): Promise<Response | null> => {
  const url = new URL(request.url);
  if (url.pathname === "/auth/login" && request.method === "GET")
    return startLogin(request);
  if (url.pathname === "/auth/callback" && request.method === "GET")
    return finishLogin(request);
  if (url.pathname === "/auth/logout" && request.method === "POST")
    return logout(request);
  return null;
};

export const protectRequest = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;
  if (path === "/settings/tokens" && request.method === "POST") {
    const user = await authorizeRequest(request);
    if (!user)
      return json({ error: "Unauthorized" }, 401);
    if (!request.headers.get("origin") || request.headers.get("origin") !== requestUrl.origin)
      return json({ error: "Forbidden" }, 403);
    return json(await createUserToken(user), 201);
  }
  if (path === "/settings/tokens" && request.method === "DELETE") {
    const user = await authorizeRequest(request);
    if (!user)
      return json({ error: "Unauthorized" }, 401);
    const tokenId = requestUrl.searchParams.get("id");
    if (!tokenId || !request.headers.get("origin") || request.headers.get("origin") !== requestUrl.origin)
      return json({ error: "Forbidden" }, 403);
    await revokeUserToken(user, tokenId);
    return new Response(null, { status: 204 });
  }
  if (path === "/graphql" && request.method === "OPTIONS")
    return null;
  if (path === "/login" && request.method === "GET") {
    const user = await requireUser(request);
    if (user)
      return Response.redirect(new URL("/", request.url), 302);
    const returnTo = `${requestUrl.searchParams.get("returnTo") ?? "/"}`;
    const returnToUrl = new URL(returnTo, requestUrl);
    const safeReturnTo = returnToUrl.origin === requestUrl.origin && !returnToUrl.pathname.startsWith("/auth/") && returnToUrl.pathname !== "/login" ? `${returnToUrl.pathname}${returnToUrl.search}${returnToUrl.hash}` : "/";
    const loginUrl = `/auth/login?returnTo=${encodeURIComponent(safeReturnTo)}`;
    return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sign in - Teruko</title></head><body style="font-family: sans-serif; max-width: 32rem; margin: 12vh auto; padding: 2rem"><h1>Sign in to Teruko</h1><p>Sign in with your organization account to view the gallery.</p><a href="${loginUrl}" style="display:inline-block;padding:.8rem 1.2rem;background:#193c3e;color:white;text-decoration:none">Continue with Authentik</a></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  }
  const authResponse = await authHandler(request);
  if (authResponse)
    return authResponse;
  if (path.startsWith("/assets/") || path.startsWith("/_nuxt/") || path.startsWith("/_build/") || path.startsWith("/_app/") || path.startsWith("/favicon") || /^\/[^/]+\.(?:css|js|mjs|map|woff2?|ttf|svg|png|ico)$/.test(path))
    return null;
  if (path === "/graphql")
    return await requireGraphqlUser(request) ? null : json({ errors: [{ message: "Unauthorized" }] }, 401);
  if (path.startsWith("/img/") || /^\/\d+(?:\/|$)/.test(path)) {
    const user = await authorizeRequest(request);
    if (user)
      return null;
    if (/^\/\d+\/[^/]+$/.test(path))
      return new Response("Unauthorized", { status: 401 });
    return Response.redirect(new URL(`/login?returnTo=${encodeURIComponent(`${path}${requestUrl.search}`)}`, request.url), 302);
  }
  const user = await authorizeRequest(request);
  if (user)
    return null;
  if (request.method === "GET" || request.method === "HEAD") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${path}${new URL(request.url).search}`);
    return Response.redirect(loginUrl, 302);
  }
  return new Response("Unauthorized", { status: 401 });
};
