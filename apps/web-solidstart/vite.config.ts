import { solidStart } from "@solidjs/start/config";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solidStart({ middleware: "src/middleware.ts" })],
  server: {
    host: "0.0.0.0",
  },
});
