import { eq } from "drizzle-orm";
import { TagExt } from "models";

import { dTag, dTagCategory, db } from "../db/index.js";
import { PothosTagCategory } from "./TagCategory.js";
import { builder } from "./builder.js";

export const PothosTag = builder.objectRef<TagExt>("Tag");

builder.node(PothosTag, {
  id: {
    resolve: (parent) => parent.slug,
  },
  loadOne: async (id) => {
    const res = await db
      .select()
      .from(dTag)
      .where(eq(dTag.slug, id))
      .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug));

    const item = res[0];

    if (!item) {
      return null;
    }

    return {
      ...item.Tag,
      category: item.TagCategory,
    };
  },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    category: t.field({
      type: PothosTagCategory,
      nullable: true,
      resolve: async (parent) => {
        if (!parent.categorySlug) {
          return;
        }

        if (parent.category !== undefined) {
          return parent.category;
        }

        const res = await db
          .select()
          .from(dTagCategory)
          .where(eq(dTagCategory.slug, parent.categorySlug));

        return res[0];
      },
    }),
  }),
});

export {};
