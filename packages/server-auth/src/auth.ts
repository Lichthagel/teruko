import { Buffer } from "node:buffer";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import * as oidc from "openid-client";
import { dAuthSession, db, dUserToken } from "server-db";
import env from "server-env";

export type AuthUser = { subject: string; email: string | null };

const cookieName = "__Host-teruko_session";
const sessionCookieName = (request: Request) => secureCookie(request) ? cookieName : "teruko_session";
const sessionTtlSeconds = 60 * 60 * 24 * 7;
const transactionTtlSeconds = 60 * 10;
const cookiePath = "/";
const testUser = { subject: "teruko-e2e-test-user", email: "test@example.invalid" };
const testAuthEnabled = () => env.NODE_ENV === "test" && process.env.AUTH_TEST_BYPASS === "1";
const testBearerEnabled = () => testAuthEnabled() && process.env.AUTH_TEST_ALLOW_BEARER === "1";
const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const signature = (value: string) => createHmac("sha256", authConfig().sessionSecret).update(value).digest("base64url");

const authConfig = () => {
  const { OIDC_ISSUER_URL, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, AUTH_SESSION_SECRET } = env;
  if (!OIDC_ISSUER_URL || !OIDC_CLIENT_ID || !OIDC_CLIENT_SECRET || !AUTH_SESSION_SECRET || AUTH_SESSION_SECRET.length < 32 || (env.NODE_ENV === "production" && !env.AUTH_BASE_URL)) {
    throw new Error("OIDC issuer, client credentials, a 32+ character session secret, and AUTH_BASE_URL in production are required");
  }
  if (env.AUTH_BASE_URL && !/^https?:\/\//.test(env.AUTH_BASE_URL))
    throw new Error("AUTH_BASE_URL must be an absolute HTTP(S) origin");
  return { issuer: OIDC_ISSUER_URL, clientId: OIDC_CLIENT_ID, clientSecret: OIDC_CLIENT_SECRET, sessionSecret: AUTH_SESSION_SECRET };
};

let oidcConfiguration: Promise<oidc.Configuration> | undefined;
const getOidcConfiguration = () => {
  const { issuer, clientId, clientSecret } = authConfig();
  oidcConfiguration ??= oidc.discovery(new URL(issuer), clientId, { token_endpoint_auth_method: "client_secret_basic" }, oidc.ClientSecretBasic(clientSecret));
  return oidcConfiguration;
};

const baseUrl = (request: Request) => {
  const configuredUrl = env.AUTH_BASE_URL;
  if (configuredUrl)
    return new URL(configuredUrl);
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost?.split(",")[0]?.trim() ?? url.host;
  const protocol = forwardedProto?.split(",")[0]?.trim() === "https" ? "https" : url.protocol.replace(":", "");
  return new URL(`${protocol}://${host}`);
};

const cookieValue = (request: Request, name: string) => request.headers.get("cookie")
  ?.split(";")
  .map(part => part.trim())
  .find(part => part.startsWith(`${name}=`))
  ?.slice(name.length + 1);

const verifySignedValue = (value: string) => {
  const separator = value.lastIndexOf(".");
  if (separator < 1)
    return null;
  const payload = value.slice(0, separator);
  const suppliedSignature = Buffer.from(value.slice(separator + 1));
  const expectedSignature = Buffer.from(signature(payload));
  return suppliedSignature.length === expectedSignature.length && timingSafeEqual(suppliedSignature, expectedSignature) ? payload : null;
};

const secureCookie = (request: Request) => baseUrl(request).protocol === "https:";
const isSameOrigin = (request: Request, origin: string) => {
  try {
    return new URL(origin).origin === baseUrl(request).origin;
  } catch {
    return false;
  }
};
export const isSameOriginRequest = (request: Request, origin: string) => isSameOrigin(request, origin);

const cookieHeader = (request: Request, name: string, value: string, maxAge: number) =>
  `${name}=${value}; Path=${cookiePath}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureCookie(request) ? "; Secure" : ""}`;

const appendCookie = (response: Response, value: string) => {
  response.headers.append("Set-Cookie", value);
  return response;
};

export const getSession = async (request: Request): Promise<AuthUser | null> => {
  const rawId = cookieValue(request, sessionCookieName(request));
  const id = rawId ? verifySignedValue(rawId) : null;
  if (!id)
    return null;
  const result = await db.select({ subject: dAuthSession.subject, email: dAuthSession.email })
    .from(dAuthSession)
    .where(and(eq(dAuthSession.id, id), gt(dAuthSession.expiresAt, new Date())))
    .limit(1);
  const user = result[0];
  return user ? { subject: user.subject, email: user.email } : null;
};

export const authenticateRequest = async (request: Request): Promise<AuthUser | null> => {
  if (testAuthEnabled() && (!request.headers.get("authorization")?.startsWith("Bearer ") || !testBearerEnabled()))
    return testUser;
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    const rawToken = authorization.slice("Bearer ".length);
    if (rawToken.length < 40 || rawToken.length > 256)
      return null;
    return authenticateUserToken(rawToken);
  }
  return getSession(request);
};

const authenticateUserToken = async (rawToken: string): Promise<AuthUser | null> => {
  if (rawToken.length < 40 || rawToken.length > 256)
    return null;
  const match = await db.select({ subject: dUserToken.subject })
    .from(dUserToken)
    .where(and(eq(dUserToken.tokenHash, sha256(rawToken)), isNull(dUserToken.revokedAt)))
    .limit(1);
  return match[0] ? { subject: match[0].subject, email: null } : null;
};

export const requireUser = async (request: Request) => {
  if (testAuthEnabled() && !request.headers.get("authorization")?.startsWith("Bearer "))
    return testUser;
  const user = await getSession(request);
  if (!user)
    return null;
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && request.method !== "HEAD" && (!origin || !isSameOrigin(request, origin)))
    return null;
  if (origin && !isSameOrigin(request, origin))
    return null;
  return user;
};

export const requireSessionUser = async (request: Request): Promise<AuthUser | null> => {
  if (testAuthEnabled())
    return testUser;
  const user = await getSession(request);
  if (!user)
    return null;
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && request.method !== "HEAD" && (!origin || !isSameOrigin(request, origin)))
    return null;
  if (origin && !isSameOrigin(request, origin))
    return null;
  return user;
};

export const authorizeRequest = async (request: Request): Promise<AuthUser | null> => {
  if (request.headers.get("authorization")?.startsWith("Bearer "))
    return authenticateRequest(request);
  return requireUser(request);
};

export const startLogin = async (request: Request) => {
  const configuration = await getOidcConfiguration();
  const verifier = oidc.randomPKCECodeVerifier();
  const nonce = oidc.randomNonce();
  const state = randomToken();
  const challenge = await oidc.calculatePKCECodeChallenge(verifier);
  const redirectUri = new URL("/auth/callback", baseUrl(request));
  const requestedReturnTo = new URL(request.url).searchParams.get("returnTo") ?? "/";
  const returnToUrl = new URL(requestedReturnTo, baseUrl(request));
  const returnTo = returnToUrl.origin === baseUrl(request).origin && !returnToUrl.pathname.startsWith("/auth/") && returnToUrl.pathname !== "/login" ? `${returnToUrl.pathname}${returnToUrl.search}${returnToUrl.hash}` : "/";
  const authorizationUrl = oidc.buildAuthorizationUrl(configuration, {
    redirect_uri: redirectUri.href,
    response_type: "code",
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
    nonce,
    state,
  });
  const transactionPayload = Buffer.from(JSON.stringify({ verifier, nonce, state, redirectUri: redirectUri.href, returnTo, createdAt: Date.now() })).toString("base64url");
  return appendCookie(Response.redirect(authorizationUrl.href, 302), cookieHeader(request, "teruko_oidc", `${transactionPayload}.${signature(transactionPayload)}`, transactionTtlSeconds));
};

export const finishLogin = async (request: Request) => {
  const rawCookie = cookieValue(request, "teruko_oidc");
  const raw = rawCookie ? verifySignedValue(rawCookie) : null;
  if (!raw)
    return new Response("Missing or invalid OIDC transaction", { status: 400 });
  try {
    const transaction = JSON.parse(Buffer.from(raw, "base64url").toString()) as {
      verifier: string;
      nonce: string;
      state: string;
      redirectUri: string;
      returnTo?: string;
      createdAt: number;
    };
    if (!transaction.verifier || !transaction.nonce || !transaction.state || !transaction.redirectUri || !Number.isFinite(transaction.createdAt) || Date.now() - transaction.createdAt > transactionTtlSeconds * 1000)
      return new Response("Expired OIDC transaction", { status: 400 });
    const callbackUrl = new URL(transaction.redirectUri);
    callbackUrl.search = new URL(request.url).search;
    const tokens = await oidc.authorizationCodeGrant(await getOidcConfiguration(), callbackUrl, {
      pkceCodeVerifier: transaction.verifier,
      expectedNonce: transaction.nonce,
      expectedState: transaction.state,
    });
    const claims = tokens.claims();
    if (!claims?.sub)
      return new Response("OIDC response has no subject", { status: 400 });
    const id = randomToken();
    const expiresAt = new Date(Date.now() + sessionTtlSeconds * 1000);
    await db.delete(dAuthSession).where(lt(dAuthSession.expiresAt, new Date()));
    await db.insert(dAuthSession).values({ id, subject: claims.sub, email: typeof claims.email === "string" ? claims.email : null, expiresAt });
    const response = appendCookie(Response.redirect(new URL(transaction.returnTo ?? "/", baseUrl(request)), 302), cookieHeader(request, sessionCookieName(request), `${id}.${signature(id)}`, sessionTtlSeconds));
    return appendCookie(response, cookieHeader(request, "teruko_oidc", "", 0));
  } catch (error) {
    console.error("OIDC callback failed", error);
    return new Response("Authentication failed", { status: 400, headers: { "Set-Cookie": cookieHeader(request, "teruko_oidc", "", 0) } });
  }
};

export const logout = async (request: Request) => {
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && (!origin || !isSameOrigin(request, origin)))
    return new Response("Forbidden", { status: 403 });
  const id = cookieValue(request, sessionCookieName(request));
  const sessionId = id ? verifySignedValue(id) : null;
  if (sessionId)
    await db.delete(dAuthSession).where(eq(dAuthSession.id, sessionId));
  return new Response(null, { status: 303, headers: { "Location": "/login", "Set-Cookie": cookieHeader(request, sessionCookieName(request), "", 0) } });
};

export const resetUserToken = async (user: AuthUser) => {
  const token = `teruko_${randomToken(32)}`;
  const id = randomToken(16);
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${user.subject}))`);
    await tx.update(dUserToken).set({ revokedAt: new Date() }).where(and(eq(dUserToken.subject, user.subject), isNull(dUserToken.revokedAt)));
    await tx.insert(dUserToken).values({ id, subject: user.subject, tokenHash: sha256(token) });
  });
  return { id, token };
};

export const userTokenStatus = async (user: AuthUser) => {
  const active = await db.select({ createdAt: dUserToken.createdAt })
    .from(dUserToken)
    .where(and(eq(dUserToken.subject, user.subject), isNull(dUserToken.revokedAt)))
    .orderBy(sql`${dUserToken.createdAt} DESC`)
    .limit(1);
  return { active: active.length > 0, createdAt: active[0]?.createdAt.toISOString() ?? null };
};
