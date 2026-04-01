/// <reference path="../../env.d.ts" />

import { defineConfig } from "drizzle-kit";
import { ENV } from "varlock/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
});
