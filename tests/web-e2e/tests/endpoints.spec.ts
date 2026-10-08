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

  test("opens the signed-in userscript token settings", async ({ request }) => {
    const response = await request.get("/settings/tokens");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Create token");
  });

  test("token management endpoints require an authenticated origin", async ({ request }) => {
    const response = await request.post("/settings/tokens", { data: {} });

    expect(response.status()).toBe(403);
  });

  test("test-only bearer token can be revoked", async ({ request }, testInfo) => {
    const origin = testInfo.project.use.baseURL as string;
    const minted = await request.post("/settings/tokens", { headers: { Origin: origin }, data: {} });
    expect(minted.status()).toBe(201);
    const { id, token } = await minted.json() as { id: string; token: string };

    const query = await request.post("/graphql", {
      headers: { Authorization: `Bearer ${token}` },
      data: { query: "{ images(first: 1) { edges { node { id } } } }" },
    });
    expect(query.status()).toBe(200);

    const revoked = await request.delete(`/settings/tokens?id=${encodeURIComponent(id)}`, { headers: { Origin: origin }, data: {} });
    expect(revoked.status()).toBe(204);
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
