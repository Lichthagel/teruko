import { eq, sql } from "drizzle-orm";
import { db, dTag, dTagCategory } from "server-db";

import type { builder } from "../builder.js";

import { PothosTag } from "../Tag.js";

const tagSuggestions = (b: typeof builder) =>
  b.queryField("tagSuggestions", (t) =>
    t.field({
      type: [PothosTag],
      args: {
        query: t.arg.string({
          required: true,
        }),
      },
      resolve: async (parent, { query }) => {
        const result = await db
          .select()
          .from(dTag)
          .where(
            sql`LOWER(${dTag.slug}) LIKE LOWER(${`%${query}%`}) ESCAPE '\\'`,
          )
          .orderBy(sql`CHAR_LENGTH(${dTag.slug})`)
          .limit(10)
          .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug));

        return result.map((r) => ({
          ...r.Tag,
          category: r.TagCategory,
        }));
      },
    }));

export default tagSuggestions;
