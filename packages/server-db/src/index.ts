import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import env from "server-env";

import schema from "./schema/index.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const findMigrationsFolder = () => {
  const moduleDirectory = dirname(fileURLToPath(import.meta.url));
  const roots = [
    process.cwd(),
    moduleDirectory,
  ];
  const candidates = [process.env.DRIZZLE_MIGRATIONS_FOLDER];

  for (const root of roots) {
    let directory = resolve(root);

    while (true) {
      candidates.push(resolve(directory, "packages/server-db/drizzle"));
      candidates.push(resolve(directory, "drizzle"));

      const parent = dirname(directory);
      if (parent === directory) {
        break;
      }

      directory = parent;
    }
  }

  return candidates.find(folder => folder && existsSync(resolve(folder, "meta/_journal.json")));
};

const migrationsFolder = findMigrationsFolder();
const migrationLockId = 742391028;
let migrationPromise: Promise<void> | undefined;

export const db = drizzle({
  client: pool,
  schema,
  logger: env.NODE_ENV === "development",
});

const migrateDatabase = async () => {
  const client = await pool.connect();
  let lockAcquired = false;

  try {
    await client.query("SELECT pg_advisory_lock($1)", [migrationLockId]);
    lockAcquired = true;

    if (!migrationsFolder) {
      throw new Error("Could not locate server-db Drizzle migrations");
    }

    await migrate(drizzle({ client, schema }), { migrationsFolder });
  } finally {
    try {
      if (lockAcquired) {
        await client.query("SELECT pg_advisory_unlock($1)", [migrationLockId]);
      }
    } finally {
      client.release();
    }
  }
};

export const ensureDatabaseReady = () => {
  migrationPromise ??= migrateDatabase();
  return migrationPromise;
};

export * from "./schema/index.js";
