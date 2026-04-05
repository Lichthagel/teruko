import type { TagExt, TagRuleExt } from "models";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db, dTag, dTagCategory, dTagRule } from "server-db";
import { builder } from "./builder.js";
import { PothosTagCategory } from "./TagCategory.js";
import { PothosTagRule } from "./TagRule.js";

export const PothosTag = builder.objectRef<TagExt>("Tag");

builder.node(PothosTag, {
  id: {
    resolve: parent => parent.slug,
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
  fields: t => ({
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
    rules: t.field({
      type: [PothosTagRule],
      resolve: async (parent) => {
        const dOtherTag = alias(dTag, "OtherTag");
        const res = await db
          .select()
          .from(dTagRule)
          .innerJoin(dTag, eq(dTag.id, dTagRule.tagId))
          .where(eq(dTag.slug, parent.slug))
          .leftJoin(dOtherTag, eq(dOtherTag.id, dTagRule.otherTagId));

        return res.map(row => ({
          id: row.TagRule.id,
          tag: row.Tag,
          tagSlug: row.Tag.slug,
          kind: row.TagRule.ruleKind,
          otherTag: row.OtherTag ?? undefined,
          otherTagSlug: row.OtherTag?.slug,
        } satisfies TagRuleExt));
      },
    }),
    referencingRules: t.field({
      type: [PothosTagRule],
      resolve: async (parent) => {
        const dOtherTag = alias(dTag, "OtherTag");
        const res = await db
          .select()
          .from(dTagRule)
          .innerJoin(dOtherTag, eq(dOtherTag.id, dTagRule.otherTagId))
          .where(eq(dOtherTag.slug, parent.slug))
          .innerJoin(dTag, eq(dTag.id, dTagRule.tagId));

        return res.map(row => ({
          id: row.TagRule.id,
          tag: row.Tag,
          tagSlug: row.Tag.slug,
          kind: row.TagRule.ruleKind,
          otherTag: row.OtherTag,
          otherTagSlug: row.OtherTag?.slug,
        } satisfies TagRuleExt));
      },
    }),
  }),
});
