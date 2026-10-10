import { Buffer } from "node:buffer";
import { execFileSync, spawn } from "node:child_process";
import { createHash, createSign, generateKeyPairSync, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const workspacePath = fileURLToPath(new URL("../..", import.meta.url));
const testClientId = "teruko-e2e-client";
const testOidcClientSecret = "teruko-e2e-client-secret";
const testSessionSecret = "teruko-e2e-session-secret-that-is-long-enough";
const { privateKey: oidcPrivateKey, publicKey: oidcPublicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const oidcPublicJwk = {
  ...(oidcPublicKey.export({ format: "jwk" }) as JsonWebKey),
  kid: "teruko-e2e-key",
  use: "sig",
  alg: "RS256",
};
const authorizationCodes = new Map<string, { challenge: string; nonce: string; clientId: string }>();
let testOidcIssuer = "";
const mockOidcProvider = createServer((request, response) => {
  void (async () => {
    const url = new URL(request.url ?? "/", testOidcIssuer || "http://127.0.0.1");
    if (url.pathname === "/.well-known/openid-configuration") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        issuer: testOidcIssuer,
        authorization_endpoint: `${testOidcIssuer}/authorize`,
        token_endpoint: `${testOidcIssuer}/token`,
        jwks_uri: `${testOidcIssuer}/jwks`,
        response_types_supported: ["code"],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256"],
        token_endpoint_auth_methods_supported: ["client_secret_basic"],
        code_challenge_methods_supported: ["S256"],
      }));
      return;
    }

    if (url.pathname === "/jwks") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ keys: [oidcPublicJwk] }));
      return;
    }

    if (url.pathname === "/authorize") {
      const redirectUri = url.searchParams.get("redirect_uri");
      const state = url.searchParams.get("state");
      const nonce = url.searchParams.get("nonce");
      const challenge = url.searchParams.get("code_challenge");
      const clientId = url.searchParams.get("client_id");
      if (!redirectUri || !state || !nonce || !challenge || !clientId || url.searchParams.get("code_challenge_method") !== "S256") {
        response.writeHead(400).end("Invalid authorization request");
        return;
      }
      const code = randomUUID();
      authorizationCodes.set(code, { challenge, nonce, clientId });
      const callback = new URL(redirectUri);
      callback.searchParams.set("code", code);
      callback.searchParams.set("state", state);
      callback.searchParams.set("iss", testOidcIssuer);
      response.writeHead(302, { Location: callback.href }).end();
      return;
    }

    if (url.pathname === "/token" && request.method === "POST") {
      const chunks: Buffer[] = [];
      for await (const chunk of request)
        chunks.push(Buffer.from(chunk));
      const form = new URLSearchParams(Buffer.concat(chunks).toString());
      const code = form.get("code") ?? "";
      const transaction = authorizationCodes.get(code);
      const verifier = form.get("code_verifier") ?? "";
      const challenge = createHash("sha256").update(verifier).digest("base64url");
      if (form.get("grant_type") !== "authorization_code" || !transaction || transaction.clientId !== testClientId || transaction.challenge !== challenge) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "invalid_grant" }));
        return;
      }
      authorizationCodes.delete(code);
      const now = Math.floor(Date.now() / 1000);
      const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
      const unsigned = `${encode({ alg: "RS256", typ: "JWT", kid: "teruko-e2e-key" })}.${encode({
        iss: testOidcIssuer,
        sub: "teruko-e2e-oidc-user",
        aud: testClientId,
        iat: now,
        exp: now + 300,
        nonce: transaction.nonce,
        email: "e2e@example.invalid",
      })}`;
      const signer = createSign("RSA-SHA256");
      signer.update(unsigned);
      signer.end();
      const idToken = `${unsigned}.${signer.sign(oidcPrivateKey).toString("base64url")}`;
      response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ access_token: randomUUID(), token_type: "Bearer", expires_in: 300, id_token: idToken }));
      return;
    }

    response.writeHead(404).end("Not Found");
  })().catch((error) => {
    response.writeHead(500).end(String(error));
  });
});

const startMockOidcProvider = () => new Promise<void>((resolve, reject) => {
  mockOidcProvider.once("error", reject);
  mockOidcProvider.listen(0, "127.0.0.1", () => {
    const address = mockOidcProvider.address();
    if (!address || typeof address === "string") {
      reject(new Error("Could not determine mock OIDC provider port"));
      return;
    }
    testOidcIssuer = `http://127.0.0.1:${address.port}`;
    resolve();
  });
});

const apps = [
  {
    args: [".output/server/index.mjs"],
    command: process.execPath,
    cwd: "apps/web-nuxt",
    port: 3100,
  },
  {
    args: ["server.mjs"],
    command: process.execPath,
    cwd: "apps/web-solidstart",
    port: 3101,
  },
  {
    args: ["build/index.js"],
    command: process.execPath,
    cwd: "apps/web-svelte",
    port: 3102,
  },
  {
    args: [".output/server/index.mjs"],
    command: process.execPath,
    cwd: "apps/web-tanstack-react",
    port: 3103,
  },
] as const;

const run = (args: string[]) => {
  execFileSync(process.platform === "win32" ? "pnpm.cmd" : "pnpm", args, {
    cwd: workspacePath,
    shell: process.platform === "win32",
    stdio: "inherit",
  });
};

const waitForServer = async (port: number, server: ReturnType<typeof spawn>) => {
  const url = `http://127.0.0.1:${port}/`;
  const deadline = Date.now() + 180_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Server on port ${port} exited with code ${server.exitCode}`);
    }

    try {
      await fetch(url);
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Timed out waiting for ${url}`);
};

const globalSetup = async () => {
  await startMockOidcProvider();
  if (process.env.SKIP_E2E_DB_SETUP !== "1") {
    run(["--filter", "server-db", "exec", "drizzle-kit", "migrate"]);
    run(["--filter", "server-db", "run", "seed"]);
  }

  const servers = apps.map(({ args, command, cwd, port }) => {
    const server = spawn(command, args, {
      cwd: path.join(workspacePath, cwd),
      detached: true,
      env: {
        ...process.env,
        HOST: "127.0.0.1",
        NODE_ENV: "test",
        AUTH_TEST_BYPASS: "1",
        AUTH_TEST_ALLOW_BEARER: "1",
        OIDC_ISSUER_URL: testOidcIssuer,
        OIDC_CLIENT_ID: testClientId,
        OIDC_CLIENT_SECRET: testOidcClientSecret,
        AUTH_SESSION_SECRET: testSessionSecret,
        IMG_FOLDER: process.env.IMG_FOLDER ?? path.join(workspacePath, "data"),
        NITRO_HOST: "127.0.0.1",
        ...(cwd === "apps/web-svelte" ? { PROTOCOL_HEADER: "x-forwarded-proto" } : {}),
        PORT: String(port),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    server.stdout?.on("data", chunk => process.stdout.write(`[e2e:${port}] ${chunk}`));
    server.stderr?.on("data", chunk => process.stderr.write(`[e2e:${port}] ${chunk}`));
    return server;
  });

  try {
    await Promise.all(apps.map(({ port }, index) => waitForServer(port, servers[index]!)));
  } catch (error) {
    for (const server of servers) {
      server.kill();
    }
    mockOidcProvider.close();
    throw error;
  }

  return async () => {
    for (const server of servers) {
      if (server.pid) {
        try {
          process.kill(-server.pid, "SIGTERM");
        } catch {
          server.kill();
        }
      }
    }
    await new Promise<void>(resolve => mockOidcProvider.close(() => resolve()));
  };
};

export default globalSetup;
