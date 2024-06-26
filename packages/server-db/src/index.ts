import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "server-env";

import schema from "./schema.js";

export const pgClient = postgres(env.DATABASE_URL, {
  connection: {
    application_name: "teruko-svelte",
  },
});

export const db = drizzle(pgClient, {
  schema,
  logger: env.NODE_ENV === "development",
});

export * from "./schema.js";
