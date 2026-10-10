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
    await page.goto("/login?returnTo=%2Fsettings%2Ftokens");

    const authorizationUrl = new URL((await authorizationRequest).url());
    expect(authorizationUrl.searchParams.get("code_challenge_method")).toBe("S256");
    await expect(page).toHaveURL(/\/settings\/tokens$/);
    await expect(page.getByRole("heading", { name: "Userscript access" })).toBeVisible();
  });

  test("auth API routes reach their framework handlers", async ({ request }, testInfo) => {
    const origin = testInfo.project.use.baseURL as string;
    const callback = await request.get("/auth/callback");
    const logout = await request.post("/auth/logout", { headers: { Origin: origin }, maxRedirects: 0 });

    expect(callback.status()).toBe(400);
    expect(logout.status()).toBe(303);
    expect(logout.headers().location).toBe("/login");
  });

  test("opens the signed-in userscript token settings", async ({ page }) => {
    await page.goto("/settings/tokens");

    await expect(page.getByRole("heading", { name: "Userscript access" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Generate / reset token" })).toBeVisible();
  });

  test("generates and resets the userscript bearer token", async ({ page, request }) => {
    await page.goto("/settings/tokens");

    await page.getByRole("button", { name: "Generate / reset token" }).click();
    const firstToken = page.getByLabel("New bearer token");
    await expect(firstToken).toContainText(/^teruko_/);
    const firstSecret = (await firstToken.textContent()) ?? "";
    const firstAccess = await request.post("/graphql", {
      headers: { Authorization: `Bearer ${firstSecret}` },
      data: { query: "{ images(first: 1) { edges { node { id } } } }" },
    });
    expect(firstAccess.status()).toBe(200);

    await page.getByRole("button", { name: "Generate / reset token" }).click();
    await expect(page.getByLabel("New bearer token")).not.toHaveText(firstSecret ?? "");
    await expect(page.getByLabel("New bearer token")).toContainText(/^teruko_/);
    const revokedAccess = await request.post("/graphql", {
      headers: { Authorization: `Bearer ${firstSecret}` },
      data: { query: "{ images(first: 1) { edges { node { id } } } }" },
    });
    expect(revokedAccess.status()).toBe(401);
  });

  test("token management endpoints require an authenticated origin", async ({ request }) => {
    const response = await request.post("/api/settings/tokens", { headers: { Origin: "https://not-teruko.invalid" }, data: {} });

    expect(response.status()).toBe(403);
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
