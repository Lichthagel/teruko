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

  test("navigates in gallery order using real GraphQL responses", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith("web-nuxt-"), "Existing Nuxt production SPA hydration issue");
    await page.route("**/img/*", route => route.fulfill({
      contentType: "image/svg+xml",
      body: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\"/>",
    }));
    const galleryResponse = page.waitForResponse(async (response) => {
      if (!response.url().includes("/graphql"))
        return false;
      return !!(await response.json()).data?.images?.edges;
    });
    await page.goto("/");
    const result = await (await galleryResponse).json();
    expect(typeof result.data.images.edges[0].node.id).toBe("string");
    const cards = page.locator("[data-gallery]");
    const hrefs: string[] = [];
    for (let index = 0; index < 3; index++) {
      const card = cards.locator(`[data-index='${index}'] a:has(img)`);
      await expect(card).toBeVisible();
      hrefs.push((await card.getAttribute("href"))!);
    }
    await cards.locator("[data-index='0'] a:has(img)").click();
    const next = page.locator("button[data-direction='next']").last();
    const previous = page.getByRole("button", { name: "Previous image", exact: true });
    const expectImage = async (index: number) => {
      await expect(page).toHaveURL(new RegExp(`${hrefs[index]}$`));
      await expect(page.locator("[data-image-id]")).toHaveAttribute("data-image-id", hrefs[index]!.slice(1));
    };
    await expect(next).toBeEnabled();
    await page.keyboard.press("ArrowRight");
    await expectImage(1);
    await expect(previous).toBeEnabled();
    await page.keyboard.press("ArrowLeft");
    await expectImage(0);
    await next.click();
    await expectImage(1);
    await page.locator("[data-image-id] img").click();
    await expectImage(2);
    await previous.click();
    await expectImage(1);
  });

  test("does not invent a navigation order for a direct detail link", async ({ page }) => {
    await page.route("**/img/*", route => route.fulfill({
      contentType: "image/svg+xml",
      body: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\"/>",
    }));
    await page.goto(`/${seededImage.id}`);
    await expect(page.locator("h1")).toHaveText(seededImage.title);
    await expect(page.getByRole("button", { name: "Previous image", exact: true })).toBeDisabled();
    await expect(page.locator("button[data-direction='next']").last()).toBeDisabled();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(new RegExp(`/${seededImage.id}$`));
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
