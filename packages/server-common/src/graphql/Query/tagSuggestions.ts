import { db, dTag, dTagCategory } from "../../db/index.js";
import { builder } from "../builder.js";
import { eq, sql } from "drizzle-orm";
import { PothosTag } from "../Tag.js";

export default (b: typeof builder) =>
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
            sql`LOWER(${dTag.slug}) LIKE LOWER(${`%${query}%`}) ESCAPE '\\'`
          )
          .orderBy(sql`CHAR_LENGTH(${dTag.slug})`)
          .limit(10)
          .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug));

        return result.map((r) => ({
          ...r.Tag,
          category: r.TagCategory,
        }));
      },
    })
  );
