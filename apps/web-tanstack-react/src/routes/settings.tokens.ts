import { createFileRoute } from "@tanstack/react-router";
import { authorizeRequest, createUserToken, listUserTokens, revokeUserToken } from "server-graphql";

const handler = async ({ request }: { request: Request }) => {
  const user = await authorizeRequest(request);
  if (!user)
    return Response.redirect(new URL(`/login?returnTo=${encodeURIComponent("/settings/tokens")}`, request.url), 302);
  const tokens = await listUserTokens(user);
  const tokenData = JSON.stringify(tokens.map(token => ({ id: token.id, createdAt: token.createdAt.toISOString(), revoked: Boolean(token.revokedAt) }))).replaceAll("<", "\\u003c");
  return new Response(`<!doctype html><html><body><h1>Pixiv userscript access</h1><p>Sign in and create a bearer token here, then paste it into the userscript. It is shown only once.</p><button id="create">Create token</button><pre id="token" hidden></pre><ul id="tokens"></ul><form method="post" action="/auth/logout"><button>Sign out</button></form><script>const tokens=${tokenData};for(const token of tokens){const li=document.createElement('li');li.textContent=token.id+' - '+token.createdAt+' - ';if(token.revoked)li.append('revoked');else{const button=document.createElement('button');button.textContent='Revoke';button.onclick=async()=>{await fetch('/settings/tokens?id='+encodeURIComponent(token.id),{method:'DELETE'});location.reload()};li.append(button)}document.querySelector('#tokens').append(li)}document.querySelector('#create').onclick=async()=>{const response=await fetch('/settings/tokens',{method:'POST'});const data=await response.json();const out=document.querySelector('#token');out.hidden=false;out.textContent=data.token||data.error}</script></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
};

export const Route = createFileRoute("/settings/tokens")({
  server: {
    handlers: {
      GET: handler,
      POST: async ({ request }: { request: Request }) => {
        const user = await authorizeRequest(request);
        if (!user)
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        if (!request.headers.get("origin") || request.headers.get("origin") !== new URL(request.url).origin)
          return Response.json({ error: "Forbidden" }, { status: 403 });
        return Response.json(await createUserToken(user), { status: 201, headers: { "Cache-Control": "no-store" } });
      },
      DELETE: async ({ request }: { request: Request }) => {
        const user = await authorizeRequest(request);
        if (!user)
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        const url = new URL(request.url);
        if (!request.headers.get("origin") || request.headers.get("origin") !== url.origin)
          return Response.json({ error: "Forbidden" }, { status: 403 });
        const id = url.searchParams.get("id");
        if (!id)
          return Response.json({ error: "Token id required" }, { status: 400 });
        await revokeUserToken(user, id);
        return new Response(null, { status: 204 });
      },
    },
  },
});
