import { eq } from "drizzle-orm";
import { db, dTag, dTagCategory } from "server-db";

import type { builder } from "../builder.js";

import { PothosTag } from "../Tag.js";

const tag = (b: typeof builder) =>
  b.queryField("tag", (t) =>
    t.field({
      type: PothosTag,
      nullable: true,
      args: {
        slug: t.arg.string({
          required: true,
        }),
      },
      resolve: async (parent, { slug }) => {
        const result = await db
          .select()
          .from(dTag)
          .where(eq(dTag.slug, slug))
          .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug))
          .limit(1);

        const item = result[0];

        if (!item) {
          return null;
        }

        return {
          ...item.Tag,
          category: item.TagCategory,
        };
      },
    }));

export default tag;
