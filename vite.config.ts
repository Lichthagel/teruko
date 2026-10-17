import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["apps/web-tanstack-react/src/routeTree.gen.ts"],
  },
  run: {
    cache: {
      scripts: true,
      tasks: true,
    },
    tasks: {},
  },
});
