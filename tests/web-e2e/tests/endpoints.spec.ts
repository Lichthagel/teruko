import { expect, test } from "@playwright/test";
import { appNameFromProject, notFoundText, seededImage } from "./fixtures";

test.describe("server endpoints", () => {
  test("serves the original image", async ({ request }) => {
    const response = await request.get(`/img/${seededImage.filename}`);

    expect(response.status()).toBe(200);
    expect((await response.body()).byteLength).toBeGreaterThan(0);
  });

  test("serves converted image formats", async ({ request }) => {
    for (const format of ["original", "avif", "webp"] as const) {
      const response = await request.get(`/${seededImage.id}/${format}`);

      expect(response.status()).toBe(200);
      expect((await response.body()).byteLength).toBeGreaterThan(0);
    }
  });

  test("responds to GraphQL queries", async ({ request }) => {
    const response = await request.post("/graphql", {
      data: {
        query: "{ images(first: 3) { edges { node { id title } } } }",
      },
    });
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.errors).toBeUndefined();
    expect(result.data.images.edges).toHaveLength(3);
  });

  test("redirects through the identity provider and returns to the requested page", async ({ page }) => {
    const authorizationRequest = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return url.pathname === "/authorize" && url.searchParams.has("code_challenge");
    });
    await page.setExtraHTTPHeaders({ "x-teruko-e2e-oidc": "1" });
    await page.goto("/login?returnTo=%2Faccount");

    const authorizationUrl = new URL((await authorizationRequest).url());
    expect(authorizationUrl.searchParams.get("code_challenge_method")).toBe("S256");
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
  });

  test("auth API routes reach their framework handlers", async ({ request }, testInfo) => {
    const origin = testInfo.project.use.baseURL as string;
    const callback = await request.get("/auth/callback");
    const logout = await request.post("/auth/logout", {
      headers: { Origin: origin },
      maxRedirects: 0,
    });

    expect(callback.status()).toBe(400);
    expect(logout.status()).toBe(303);
    expect(logout.headers().location).toBe("/login");
  });

  test("redirects unauthenticated page requests to the identity provider", async ({ request }, testInfo) => {
    const headers = {
      "x-teruko-e2e-oidc": "1",
      ...(testInfo.project.name.startsWith("web-svelte")
        ? { "x-forwarded-proto": "http" }
        : {}),
    };
    for (const path of ["/", "/account"]) {
      const response = await request.get(path, { headers, maxRedirects: 0 });

      expect(response.status()).toBe(302);
      expect(new URL(response.headers().location ?? "", testInfo.project.use.baseURL as string).pathname).toBe("/authorize");
    }
  });

  test("checks cookie-authenticated GraphQL origins", async ({ request }, testInfo) => {
    const origin = testInfo.project.use.baseURL as string;
    const headers = {
      "x-teruko-e2e-oidc": "1",
      ...(testInfo.project.name.startsWith("web-svelte")
        ? { "x-forwarded-proto": "http" }
        : {}),
    };
    const unauthenticated = await request.post("/graphql", {
      headers: { ...headers, Origin: origin },
      data: { query: "mutation { __typename }" },
    });
    expect(unauthenticated.status()).toBe(401);
    const login = await request.get("/login?returnTo=%2Faccount", { headers });
    expect(login.status()).toBe(200);
    expect(new URL(login.url()).pathname).toBe("/account");

    const operations = JSON.stringify({ query: "mutation { __typename }" });
    const allowed = await request.post("/graphql", {
      headers: { ...headers, Origin: origin },
      multipart: { operations },
    });
    expect(allowed.status()).toBe(200);
    expect((await allowed.json()).data.__typename).toBe("Mutation");

    for (const requestHeaders of [
      headers,
      { ...headers, Origin: "https://untrusted.example.invalid" },
    ]) {
      const rejected = await request.post("/graphql", {
        headers: requestHeaders,
        data: { query: "mutation { __typename }" },
      });
      expect(rejected.status()).toBe(401);
      const rejectedForm = await request.post("/graphql", {
        headers: requestHeaders,
        multipart: { operations },
      });
      // SvelteKit can reject form submissions before the GraphQL handler runs.
      expect([401, 403]).toContain(rejectedForm.status());
    }
  });

  test("opens the account token settings", async ({ page }) => {
    await page.goto("/account");

    await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Regenerate" })).toBeVisible();
  });

  test("generates and resets the userscript bearer token", async ({ page, request }) => {
    await page.goto("/account");

    await page.getByRole("button", { name: "Regenerate" }).click();
    const firstToken = page.getByRole("textbox", { name: "Token" });
    await expect(firstToken).toHaveValue(/^teruko_/);
    const firstSecret = await firstToken.inputValue();
    const firstAccess = await request.post("/graphql", {
      headers: { Authorization: `Bearer ${firstSecret}` },
      data: { query: "{ images(first: 1) { edges { node { id } } } }" },
    });
    expect(firstAccess.status()).toBe(200);
    const pixivAccess = await request.post("/graphql", {
      headers: { Authorization: `Bearer ${firstSecret}`, Origin: "https://www.pixiv.net" },
      data: { query: "{ images(first: 1) { edges { node { id } } } }" },
    });
    expect(pixivAccess.status()).toBe(200);

    await page.getByRole("button", { name: "Regenerate" }).click();
    const regeneratedToken = page.getByRole("textbox", { name: "Token" });
    await expect(regeneratedToken).not.toHaveValue(firstSecret);
    await expect(regeneratedToken).toHaveValue(/^teruko_/);
    const revokedAccess = await request.post("/graphql", {
      headers: { Authorization: `Bearer ${firstSecret}` },
      data: { query: "{ images(first: 1) { edges { node { id } } } }" },
    });
    expect(revokedAccess.status()).toBe(401);
  });

  test("handles unknown image IDs", async ({ page }, testInfo) => {
    await page.goto("/999999");

    const expectedText = notFoundText[appNameFromProject(testInfo.project.name)];
    if (expectedText) {
      await expect(page.locator("body")).toContainText(expectedText);
    } else {
      await expect(page.locator("h1")).toHaveCount(0);
      await expect(page.locator("img[src^='/img/']")).toHaveCount(0);
    }
  });
});
