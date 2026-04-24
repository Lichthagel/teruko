import { db, dTagCategory } from "server-db";
import { builder } from "#schema/builder.js";
import { PothosTagCategory } from "#schema/TagCategory.js";

builder.queryField("tagCategories", t =>
  t.field({
    type: [PothosTagCategory],
    resolve: async () => await db
      .select()
      .from(dTagCategory)
      .orderBy(dTagCategory.slug),
  }));
