import env from "../env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import schema from "./schema";

export const pgClient = postgres(env.DATABASE_URL, {
  connection: {
    application_name: "teruko-svelte",
  },
});

export const db = drizzle(pgClient, {
  schema,
  logger: env.NODE_ENV === "development",
});

export * from "./schema";
export * as drizzle from "drizzle-orm";
