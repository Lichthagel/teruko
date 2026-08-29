import type { Tag, TagExt } from "models";
import { eq } from "drizzle-orm";
import { db, dTag, dTagAlias, dTagCategory } from "server-db";

import { builder } from "./builder.js";
import { PothosTagCategory } from "./TagCategory.js";

export const PothosTag = builder.objectRef<Tag & Partial<TagExt>>("Tag");

builder.node(PothosTag, {
  id: {
    resolve: parent => parent.slug,
  },
  loadOne: async (id): Promise<TagExt | null> => {
    const res = await db.query.Tag.findFirst({
      where: fields => eq(fields.slug, id),
      with: {
        aliases: true,
        category: true,
      },
    });

    if (!res) {
      return null;
    }

    return {
      ...res,
      aliases: res.aliases.map(a => a.alias),
    };
  },
  fields: t => ({
    slug: t.exposeString("slug"),
    category: t.field({
      type: PothosTagCategory,
      nullable: true,
      resolve: async (parent) => {
        if (!parent.categorySlug) {
          return;
        }

        if ("category" in parent && parent.category !== undefined) {
          return parent.category;
        }

        const res = await db
          .select()
          .from(dTagCategory)
          .where(eq(dTagCategory.slug, parent.categorySlug));

        return res[0];
      },
    }),
    approved: t.exposeBoolean("approved"),
    aliases: t.field({
      type: ["String"],
      resolve: async (parent): Promise<string[]> => {
        if ("aliases" in parent && parent.aliases !== undefined) {
          return parent.aliases;
        }

        const res = await db
          .select()
          .from(dTag)
          .where(eq(dTag.slug, parent.slug))
          .innerJoin(dTagAlias, eq(dTag.id, dTagAlias.tagId));

        const items = res.map(el => el.TagAlias.alias);

        return items;
      },
    }),
  }),
});
