import { eq } from "drizzle-orm";
import { db, dTag, dTagCategory } from "../db";
import { builder } from "./builder";
import { PothosTagCategory } from "./TagCategory";
import { TagExt } from "models";

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

    return {
      ...res[0].Tag,
      category: res[0].TagCategory,
    };
  },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    category: t.field({
      type: PothosTagCategory,
      nullable: true,
      resolve: async (parent) => {
        if (!parent.categorySlug) return;

        if (parent.category !== undefined) return parent.category;

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
