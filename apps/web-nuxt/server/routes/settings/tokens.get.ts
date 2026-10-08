import { authorizeRequest, listUserTokens } from "server-graphql";

export default defineEventHandler(async (event) => {
  const forwardedProto = event.node.req.headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  const host = event.node.req.headers.host ?? "localhost";
  const request = new Request(new URL(event.node.req.url ?? "/settings/tokens", `${protocol}://${host}`), {
    headers: event.node.req.headers as HeadersInit,
  });
  const user = await authorizeRequest(request);
  if (!user)
    return sendRedirect(event, `/login?returnTo=${encodeURIComponent("/settings/tokens")}`, 302);
  const tokens = await listUserTokens(user);
  const tokenData = JSON.stringify(tokens.map(token => ({ id: token.id, createdAt: token.createdAt.toISOString(), revoked: Boolean(token.revokedAt) }))).replaceAll("<", "\\u003c");
  setResponseHeader(event, "Cache-Control", "no-store");
  return `<!doctype html><html><body><h1>Pixiv userscript access</h1><p>Sign in and create a bearer token here, then paste it into the userscript. It is shown only once.</p><button id="create">Create token</button><pre id="token" hidden></pre><ul id="tokens"></ul><form method="post" action="/auth/logout"><button>Sign out</button></form><script>const tokens=${tokenData};for(const token of tokens){const li=document.createElement('li');li.textContent=token.id+' - '+token.createdAt+' - ';if(token.revoked)li.append('revoked');else{const button=document.createElement('button');button.textContent='Revoke';button.onclick=async()=>{await fetch('/settings/tokens?id='+encodeURIComponent(token.id),{method:'DELETE'});location.reload()};li.append(button)}document.querySelector('#tokens').append(li)}document.querySelector('#create').onclick=async()=>{const response=await fetch('/settings/tokens',{method:'POST'});const data=await response.json();const out=document.querySelector('#token');out.hidden=false;out.textContent=data.token||data.error}</script></body></html>`;
});
