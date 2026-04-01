import { drizzle } from "drizzle-orm/libsql";
import { ENV } from "varlock/env";

import schema from "./schema.js";

export const db = drizzle({
  connection: ENV.DATABASE_URL,
  schema,
  logger: ENV.NODE_ENV === "development",
});

export * from "./schema.js";
