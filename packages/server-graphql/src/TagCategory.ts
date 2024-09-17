import type { TagCategory } from "models";

import { eq } from "drizzle-orm";
import { db, dTagCategory } from "server-db";

import { builder } from "./builder.js";

export const PothosTagCategory = builder.objectRef<TagCategory>("TagCategory");

builder.node(PothosTagCategory, {
  id: {
    resolve: (parent) => parent.slug,
  },
  loadOne: async (id) => {
    const res = await db
      .select()
      .from(dTagCategory)
      .where(eq(dTagCategory.slug, id));

    return res[0];
  },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    color: t.exposeString("color", { nullable: true }),
  }),
});

export {};
