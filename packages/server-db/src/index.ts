import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "server-env";

import schema from "./schema/index.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema,
  logger: env.NODE_ENV === "development",
});

export * from "./schema/index.js";
