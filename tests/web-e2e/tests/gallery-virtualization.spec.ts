import { expect, test } from "@playwright/test";

test.describe("virtual gallery", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith("web-nuxt-"), "Existing Nuxt production SPA hydration issue");
    await page.route("**/img/*", (route) => {
      const id = Number(/img_(\d+)/.exec(route.request().url())?.[1]);
      const height = (64 - id) % 3 === 0
        ? 1200
        : 600;
      return route.fulfill({
        contentType: "image/svg+xml",
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}"/>`,
      });
    });
    // Deterministic pages isolate virtualization from database cursor ordering and refreshes.
    await page.route("**/graphql*", async (route) => {
      const request = route.request();
      const params = new URL(request.url()).searchParams;
      const operation = request.method() === "POST"
        ? request.postDataJSON()
        : Object.fromEntries(params);
      if (operation.operationName !== "Images" && !operation.query?.includes("query Images(")) {
        await route.continue();
        return;
      }
      const variables = typeof operation.variables === "string"
        ? JSON.parse(operation.variables)
        : operation.variables;
      const start = Number(variables.after ?? variables.before ?? 0);
      const edges = Array.from({
        length: Math.min(20, 64 - start),
      }, (_, index) => {
        const position = start + index;
        const id = 64 - position;
        return {
          __typename: "ImageEdge",
          cursor: String(position + 1),
          node: {
            __typename: "Image",
            id,
            title: `Sample Image ${id}`,
            filename: `img_${String(id).padStart(3, "0")}.jpg`,
            width: 800,
            height: position % 3 === 0
              ? 1200
              : 600,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
            source: null,
            tags: [],
          },
        };
      });
      await route.fulfill({
        json: {
          data: {
            images: {
              __typename: "QueryImagesConnection",
              edges,
              pageInfo: {
                __typename: "PageInfo",
                startCursor: edges[0]?.cursor ?? "",
                endCursor: edges.at(-1)?.cursor ?? "",
                hasPreviousPage: start > 0,
                hasNextPage: start + edges.length < 64,
              },
            },
          },
        },
      });
    });
  });

  for (const returnVia of ["back", "home", "random"] as const) {
    test(`retains loaded pages and restores scroll via ${returnVia}`, async ({ page }) => {
      await page.goto("/");
      if (returnVia === "random") {
        await page.locator("select").selectOption("RANDOM");
      }
      const gallery = page.locator("[data-gallery]");
      await expect(gallery.locator("[data-index]").first()).toBeVisible();
      for (let i = 0; i < 3; i++) {
        await expect.poll(async () => {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          return Number(await gallery.getAttribute("data-gallery-count"));
        }).toBeGreaterThanOrEqual(Math.min(40 + i * 20, 64));
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1000));
      await expect.poll(() => gallery.locator("[data-index]").evaluateAll(nodes => Math.max(...nodes.map(node => Number(node.getAttribute("data-index")))))).toBeGreaterThan(50);
      const index = await gallery.locator("[data-index]").evaluateAll(nodes => nodes.find((node) => {
        const rect = node.getBoundingClientRect();
        return rect.bottom > 100 && rect.top < window.innerHeight - 100;
      })?.getAttribute("data-index"));
      expect(index).toBeTruthy();
      const card = gallery.locator(`[data-index="${index}"] a`).first();
      const href = await card.getAttribute("href");
      const offset = await page.evaluate(() => window.scrollY);
      const count = await gallery.locator("[data-index]").count();
      expect(count).toBeLessThan(40);
      const box = await card.boundingBox();
      expect(box).toBeTruthy();
      await page.mouse.click(box!.x + 20, Math.max(10, box!.y) + 20);
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      if (returnVia !== "home") {
        await page.goBack();
      } else {
        await page.getByRole("link", { name: "てる子" }).click();
      }
      await expect(page).toHaveURL(/\/$/);
      await expect(gallery).toHaveAttribute("data-gallery-count", "64");
      await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - offset)).toBeLessThan(8);
      await expect(gallery.locator(`[data-index="${index}"] a`).first()).toHaveAttribute("href", href!);
      expect(await gallery.locator("[data-index]").count()).toBeLessThan(40);
    });
  }

  test("changing sort clears the old position and loaded pages", async ({ page }) => {
    await page.goto("/");
    const gallery = page.locator("[data-gallery]");
    await expect(gallery.locator("[data-index]").first()).toBeVisible();
    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      return Number(await gallery.getAttribute("data-gallery-count"));
    }).toBeGreaterThanOrEqual(40);
    await page.locator("select").evaluate((node) => {
      node.value = "OLDEST";
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
    await expect(gallery.locator("[data-index=\"0\"]")).toBeVisible();
    await expect(gallery).toHaveAttribute("data-gallery-count", "20");
  });

  test("uses one column on mobile and reflows after resizing", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const gallery = page.locator("[data-gallery]");
    await expect(gallery.locator("[data-index]").first()).toBeVisible();
    await expect.poll(() => gallery.evaluate(node => getComputedStyle(node).getPropertyValue("--gallery-columns").trim())).toBe("1");
    await page.setViewportSize({ width: 1500, height: 900 });
    await expect.poll(() => gallery.evaluate(node => getComputedStyle(node).getPropertyValue("--gallery-columns").trim())).toBe("3");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
