import { expect, test } from "@playwright/test";

test.describe("gallery", () => {
  test("renders navigation and image cards", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith("web-nuxt-"), "Nuxt production SPA gallery hydration is currently unavailable");
    await page.goto("/");

    await expect(page.getByRole("link", { name: "てる子" })).toHaveAttribute("href", /^(?:\.\/|\/)$/);

    const cards = page.locator("a:has(img[src^='/img/'])");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(5);

    await expect.poll(async () => cards.first().locator("img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  });

  test("opens a detail page from an image card", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith("web-nuxt-"), "Nuxt production SPA gallery hydration is currently unavailable");
    await page.goto("/");

    const card = page.locator("a:has(img[src^='/img/'])").first();
    const href = await card.getAttribute("href");
    expect(href).toMatch(/^\/\d+$/);

    const id = href!.slice(1);
    await card.click();

    await expect(page).toHaveURL(new RegExp(`/${id}$`));
    await expect(page.locator("h1")).toHaveText(`Sample Image ${id}`);
  });
});
