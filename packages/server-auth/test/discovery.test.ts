import assert from "node:assert/strict";
import process from "node:process";
// Node's module mocks exercise discovery retries without a live identity provider.
// eslint-disable-next-line test/no-import-node-test
import { mock, test } from "node:test";
import * as oidc from "openid-client";

test("retries failed OIDC discovery and shares successful discovery between logins", async (t) => {
  const issuer = "https://identity.example.invalid";
  const configuration = new oidc.Configuration({
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
  }, "test-client");
  const error = new Error("Temporary discovery outage");
  let attempts = 0;
  const discovery = mock.fn(async () => {
    attempts++;
    if (attempts === 1)
      throw error;
    return configuration;
  });
  const moduleMock = mock.module("openid-client", {
    namedExports: { ...oidc, discovery },
  });
  t.after(() => moduleMock.restore());

  const settings = {
    NODE_ENV: "test",
    OIDC_ISSUER_URL: issuer,
    OIDC_CLIENT_ID: "test-client",
    OIDC_CLIENT_SECRET: "test-client-secret",
    AUTH_SESSION_SECRET: "test-session-secret-with-at-least-32-characters",
    AUTH_BASE_URL: "https://teruko.example.invalid",
  };
  for (const [name, value] of Object.entries(settings)) {
    const previous = process.env[name];
    process.env[name] = value;
    t.after(() => {
      if (previous === undefined)
        delete process.env[name];
      else
        process.env[name] = previous;
    });
  }

  const { startLogin } = await import("server-auth/auth");
  const request = new Request(`${settings.AUTH_BASE_URL}/login`);
  const failed = await Promise.allSettled([
    startLogin(request),
    startLogin(request),
  ]);
  for (const result of failed) {
    if (result.status === "rejected")
      assert.equal(result.reason, error);
    else
      assert.fail("Concurrent login unexpectedly succeeded during discovery outage");
  }
  assert.equal(discovery.mock.callCount(), 1);

  const recovered = await Promise.all([
    startLogin(request),
    startLogin(request),
  ]);
  for (const response of recovered) {
    assert.equal(response.status, 302);
    assert.equal(new URL(response.headers.get("location")!).origin, issuer);
  }
  assert.equal(discovery.mock.callCount(), 2);

  await startLogin(request);
  assert.equal(discovery.mock.callCount(), 2);
});
