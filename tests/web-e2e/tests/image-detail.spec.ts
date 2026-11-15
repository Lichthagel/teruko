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
    test.skip(testInfo.project.name.startsWith("web-nuxt-"), "Nuxt production SPA gallery hydration is currently unavailable");
    await page.goto("/");
    const unfilteredGallery = page.locator("[data-gallery]");
    await expect(unfilteredGallery.locator("[data-index]").first()).toBeVisible();
    const unfilteredCount = Number(await unfilteredGallery.getAttribute("data-gallery-count"));

    await page.goto(`/${seededImage.id}`);
    await page.getByRole("button", { name: seededImage.filterTag }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });

    await expect(page).toHaveURL(/\/$/);
    const filteredGallery = page.locator("[data-gallery]");
    await expect(filteredGallery.locator("[data-index]").first()).toBeVisible();
    await expect.poll(async () => Number(await filteredGallery.getAttribute("data-gallery-count"))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await filteredGallery.getAttribute("data-gallery-count"))).toBeLessThan(unfilteredCount);
  });
});
