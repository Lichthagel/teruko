import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

const apps = [
  {
    name: "web-nuxt",
    port: 3100,
  },
  {
    name: "web-solidstart",
    port: 3101,
  },
  {
    name: "web-svelte",
    port: 3102,
  },
  {
    name: "web-tanstack-react",
    port: 3103,
  },
] as const;

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    ...devices["Desktop Chrome"],
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: apps.map(app => ({
    name: app.name,
    use: {
      baseURL: `http://127.0.0.1:${app.port}`,
    },
  })),
});
