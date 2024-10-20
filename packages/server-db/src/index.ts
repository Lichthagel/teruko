import { drizzle } from "drizzle-orm/libsql";
import env from "server-env";

import schema from "./schema.js";

export const db = drizzle({
  connection: env.DATABASE_URL,
  schema,
  logger: env.NODE_ENV === "development",
});

export * from "./schema.js";
