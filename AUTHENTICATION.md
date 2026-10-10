# OIDC Authentication

The four `web-*` applications use the shared `server-graphql` OIDC endpoints. Configure an OIDC confidential web client (Authentik or another OIDC provider) with authorization-code flow, PKCE S256, and these callback URLs:

- `https://<public-host>/auth/callback` for each public web-app hostname
- If apps have distinct hostnames, register one callback URL per hostname

Set these server-side environment variables on each app:

- `OIDC_ISSUER_URL`: provider issuer URL, for example `https://auth.example.com/application/o/teruko/`
- `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET`: confidential client credentials
- `AUTH_SESSION_SECRET`: random secret of at least 32 characters, shared by apps on the same host
- `AUTH_BASE_URL`: canonical public origin, such as `https://gallery.example.com`

Apply the `server-db` Drizzle migration before starting the apps. User sessions and userscript tokens are stored in PostgreSQL. All app pages, image routes, downloads, and GraphQL operations require authentication. Generate or reset the single userscript bearer token at `/settings/tokens`; the secret is shown once, stored hashed, and reset invalidates the previous token. A valid token authenticates the same access as an OIDC session. The userscript needs its configured Teruko host in its `@connect` metadata and a signed-in Teruko browser session open to create a token.

`AUTH_TEST_BYPASS=1` only enables a fixed test identity when `NODE_ENV=test`; it must never be set in a deployed environment.
