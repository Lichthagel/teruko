import type { builder } from "#schema/builder.js";
import { PothosTagCategory } from "#schema/TagCategory.js";
import { db, dTagCategory } from "server-db";

const tagCategories = (b: typeof builder) =>
  b.queryField("tagCategories", t =>
    t.field({
      type: [PothosTagCategory],
      resolve: async () => await db
        .select()
        .from(dTagCategory)
        .orderBy(dTagCategory.slug),
    }));

export default tagCategories;
