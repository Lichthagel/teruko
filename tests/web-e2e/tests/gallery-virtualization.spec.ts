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
        const id = variables.random
          ? ([42, 17, 89][position] ?? 100 + position)
          : 64 - position;
        return {
          __typename: "ImageEdge",
          cursor: String(position + 1),
          node: {
            __typename: "Image",
            id: String(id),
            title: `Sample Image ${id}`,
            filename: `img_${String(id).padStart(3, "0")}.jpg`,
            width: 800,
            height: position % 3 === 0
              ? 1200
              : 600,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
            source: null,
            tags: [
              {
                __typename: "Tag",
                slug: "nature",
                approved: true,
                category: null,
              },
            ],
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
                hasPreviousPage: variables.last
                  ? start + edges.length < 64
                  : start > 0,
                hasNextPage: start + edges.length < 64,
              },
            },
          },
        },
      });
    });
  });

  for (const sort of ["NEWEST", "OLDEST", "RANDOM"] as const) {
    test(`detail navigation follows the ${sort} gallery and reuses cached images`, async ({ page }) => {
      const [firstId, secondId, thirdId] = sort === "RANDOM"
        ? [42, 17, 89]
        : [64, 63, 62];
      await page.goto("/");
      await page.locator("select").selectOption(sort);
      const first = page.locator("[data-index='0'] a:has(img)");
      await expect(first).toHaveAttribute("href", `/${firstId}`);
      let detailRequests = 0;
      page.on("request", (request) => {
        if (/query(?:%20|\s|\+)Image(?:%28|\()/.test(request.url()) || /query Image\(/.test(request.postData() ?? ""))
          detailRequests++;
      });
      await first.click();
      const viewer = page.locator("[data-image-id]");
      await expect(viewer).toHaveAttribute("data-image-id", String(firstId));
      await expect(page.getByRole("button", { name: "Previous image", exact: true })).toBeDisabled();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("h1")).toHaveText(`Sample Image ${secondId}`);
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator("h1")).toHaveText(`Sample Image ${firstId}`);
      await viewer.locator("button[data-direction='next']").last().click();
      await expect(page.locator("h1")).toHaveText(`Sample Image ${secondId}`);
      await viewer.locator("img").click();
      await expect(page.locator("h1")).toHaveText(`Sample Image ${thirdId}`);
      await page.keyboard.press("Shift+ArrowRight");
      await expect(viewer).toHaveAttribute("data-image-id", String(thirdId));
      await page.evaluate(() => {
        const input = document.createElement("input");
        input.id = "navigation-test-input";
        document.body.append(input);
        input.focus();
      });
      await page.keyboard.press("ArrowRight");
      await expect(viewer).toHaveAttribute("data-image-id", String(thirdId));
      await page.locator("#navigation-test-input").evaluate(input => input.remove());
      await page.getByRole("button", { name: "Previous image", exact: true }).click();
      await expect(page.locator("h1")).toHaveText(`Sample Image ${secondId}`);
      expect(detailRequests).toBe(0);
    });
  }

  test("detail navigation loads subsequent gallery pages and stops at the end", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-index='0'] a:has(img)").click();
    for (let id = 63; id >= 1; id--) {
      await expect(page.locator("button[data-direction='next']").last()).toBeEnabled();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("h1")).toHaveText(`Sample Image ${id}`);
    }
    await expect(page.locator("button[data-direction='next']").last()).toBeDisabled();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("h1")).toHaveText("Sample Image 1");
    await page.getByRole("link", { name: "てる子", exact: true }).click();
    await expect(page.locator("[data-gallery]")).toHaveAttribute("data-gallery-count", "64");
  });

  for (const returnVia of ["home", "history"] as const) {
    for (const mobile of [false, true]) {
      test(`restores the browsed image via ${returnVia} on ${mobile ? "mobile" : "desktop"}`, async ({ page }) => {
        if (mobile)
          await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/");
        await page.locator("[data-index='0'] a:has(img)").click();
        for (let id = 63; id >= 40; id--) {
          await expect(page.locator("button[data-direction='next']").last()).toBeEnabled();
          await page.keyboard.press("ArrowRight");
          await expect(page.locator("h1")).toHaveText(`Sample Image ${id}`);
        }
        for (let id = 41; id <= 44; id++) {
          await page.keyboard.press("ArrowLeft");
          await expect(page.locator("h1")).toHaveText(`Sample Image ${id}`);
        }
        if (returnVia === "home")
          await page.getByRole("link", { name: "てる子", exact: true }).click();
        else
          await page.evaluate(() => history.go(-29));
        await expect(page).toHaveURL(/\/$/);
        const card = page.locator("[data-index='20'] a:has(img)");
        await expect(card).toHaveAttribute("href", "/44");
        await expect(card).toBeInViewport();
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
      });
    }
  }

  test("detail navigation skips scroll reset but keeps smooth image-load centering", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 500 });
    await page.goto("/");
    // Isolate router scrolling from the intentional image-load centering.
    await page.evaluate(() => {
      const positions: number[] = [];
      const imageLoadScrolls: (boolean | ScrollIntoViewOptions | undefined)[] = [];
      Object.assign(window, { navigationScrollPositions: positions, imageLoadScrolls });
      window.addEventListener("scroll", () => positions.push(window.scrollY));
      Element.prototype.scrollIntoView = (options) => {
        imageLoadScrolls.push(options);
      };
    });
    await page.locator("[data-index='0'] a:has(img)").click();
    const next = page.locator("button[data-direction='next']").last();
    await expect(next).toBeEnabled();
    await expect.poll(() => page.locator("[data-image-id] img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo({ top: 80, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(80);
    await page.evaluate(() => {
      (window as unknown as { navigationScrollPositions: number[] }).navigationScrollPositions.length = 0;
    });
    for (const [key, id] of [
      ["ArrowRight", "63"],
      ["ArrowLeft", "64"],
    ]) {
      await page.keyboard.press(key!);
      await expect(page.locator("[data-image-id]")).toHaveAttribute("data-image-id", id!);
      await page.evaluate(() => new Promise<void>((resolve) => {
        let frames = 20;
        const settle = () => --frames
          ? requestAnimationFrame(settle)
          : resolve();
        requestAnimationFrame(settle);
      }));
      expect(await page.evaluate(() => window.scrollY)).toBe(80);
    }
    const positions = await page.evaluate(() => (window as unknown as { navigationScrollPositions: number[] }).navigationScrollPositions);
    expect(positions.every(position => Math.abs(position - 80) < 2)).toBe(true);
    const scrolls = await page.evaluate(() => (window as unknown as { imageLoadScrolls: ScrollIntoViewOptions[] }).imageLoadScrolls);
    expect(scrolls.length).toBeGreaterThanOrEqual(2);
    expect(scrolls.every(options => options.behavior === "smooth" && options.block === "center")).toBe(true);
  });

  test("detail navigation renders pagination errors and allows retrying", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-index='0'] a:has(img)").click();
    const next = page.locator("button[data-direction='next']").last();
    for (let id = 63; id >= 45; id--) {
      await expect(next).toBeEnabled();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("h1")).toHaveText(`Sample Image ${id}`);
    }
    await page.route("**/graphql*", route => route.fulfill({
      json: {
        errors: [
          { message: "Pagination unavailable" },
        ],
      },
    }), { times: 1 });
    await next.click();
    await expect(page.getByRole("status")).toHaveText("Unable to load the image. Please try again.");
    await expect(page.locator("h1")).toHaveText("Sample Image 45");
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page.locator("h1")).toHaveText("Sample Image 44");
    await expect(page.getByRole("status")).toBeEmpty();
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
