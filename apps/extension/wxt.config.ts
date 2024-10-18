import { defineConfig, UserManifest } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-solid"],
  manifest: ({ manifestVersion, browser }) => {
    const defaults = {
      name: "Teruko",
      permissions: [],
    } satisfies UserManifest;

    const mv3 = {
      permissions: [...defaults.permissions, "scripting"],
    } satisfies UserManifest;

    const mv2 = {} satisfies UserManifest;

    const firefox = {
      browser_specific_settings: {
        gecko: {
          id: "teruko@lichthagel.xyz",
        },
      },
    } satisfies UserManifest;

    return { ...defaults, ...(manifestVersion === 3 ? mv3 : mv2), ...(browser === "firefox" ? firefox : {}) };
  },
  browser: "firefox",
});
