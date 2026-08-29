import { expect, test } from "@playwright/test";
import { seededImage } from "./fixtures";

test.describe("image detail", () => {
  test("renders image metadata and download links", async ({ page }) => {
    await page.goto(`/${seededImage.id}`);

    await expect(page).toHaveTitle(/てる子/);
    await expect(page.locator("h1")).toHaveText(seededImage.title);
    const image = page.locator(`img[src="/img/${seededImage.filename}"]`);
    await expect(image).toBeVisible();
    await expect.poll(async () => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByText("Created At:")).toBeVisible();

    for (const format of ["original", "avif", "webp"]) {
      await expect(page.locator(`a[href="/${seededImage.id}/${format}"]`)).toBeVisible();
    }
  });

  test("filters the gallery from a tag chip", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "web-nuxt", "Nuxt production SPA gallery hydration is currently unavailable");
    await page.goto("/");
    const unfilteredCards = page.locator("a:has(img[src^='/img/'])");
    await expect(unfilteredCards.first()).toBeVisible();
    const unfilteredCount = await unfilteredCards.count();

    await page.goto(`/${seededImage.id}`);
    await page.getByRole("button", { name: seededImage.filterTag }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });

    await expect(page).toHaveURL(/\/$/);
    const filteredCards = page.locator("a:has(img[src^='/img/'])");
    await expect(filteredCards.first()).toBeVisible();
    expect(await filteredCards.count()).toBeGreaterThan(0);
    expect(await filteredCards.count()).toBeLessThan(unfilteredCount);
  });
});
