import { expect, test } from "@playwright/test";
import { notFoundText, seededImage } from "./fixtures";

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

  test("handles unknown image IDs", async ({ page }, testInfo) => {
    await page.goto("/999999");

    const expectedText = notFoundText[testInfo.project.name];
    if (expectedText) {
      await expect(page.locator("body")).toContainText(expectedText);
    } else {
      await expect(page.locator("h1")).toHaveCount(0);
      await expect(page.locator("img[src^='/img/']")).toHaveCount(0);
    }
  });
});
