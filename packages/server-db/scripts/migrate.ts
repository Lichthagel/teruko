/* eslint-disable antfu/no-import-dist */
import type { Value } from "@libsql/client";
import { createClient } from "@libsql/client";
import { d_ImageToTag, db } from "../dist/index.js";

const sqlite = createClient({
  url: "file:/workspaces/teruko/local.db",
});

const TABLE = "_ImageToTAg";
const TABLE_DRIZZLE = d_ImageToTag;
const ORDER_BY = "\"imageId\", \"tagId\"";
const CHUNK_SIZE = 1000;
const TIMESTAMP_COLS = ["createdAt", "updatedAt"];

const total = (await sqlite.execute(`SELECT COUNT(*) FROM ${TABLE}`)).rows[0][0] as number;

console.log(total);

for (let skip = 0; skip < total; skip += CHUNK_SIZE) {
  console.log(skip);

  const chunk = await sqlite.execute(`SELECT * FROM ${TABLE} ORDER BY ${ORDER_BY} LIMIT ${CHUNK_SIZE} OFFSET ${skip}`);

  try {
    db.transaction(async (tx) => {
      for (const row of chunk.rows) {
        const newRow: Record<string, Value | Date> = { ...row };

        for (const timestampCol of TIMESTAMP_COLS) {
          if (row[timestampCol]) {
            newRow[timestampCol] = new Date(row[timestampCol] as number * 1000);
          }
        }

        await tx.insert(TABLE_DRIZZLE)
          .overridingSystemValue()
          /* @ts-expect-error ignore this */
          .values(newRow);
      }
    });
  } catch (e) {
    console.error(e);
    break;
  }
}
