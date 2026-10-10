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

  test("renders a framework login page and preserves its return destination", async ({ page }) => {
    await page.goto("/login?returnTo=%2Fsettings%2Ftokens");

    await expect(page.getByRole("heading", { name: "A quieter way to browse." })).toBeVisible();
    await expect(page.locator("a[href^='/auth/login?returnTo=']")).toHaveAttribute(
      "href",
      /\/auth\/login\?returnTo=%2Fsettings%2Ftokens$/,
    );
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
