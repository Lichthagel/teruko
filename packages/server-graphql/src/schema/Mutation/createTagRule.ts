import type { builder } from "#schema/builder.js";
import type { TagRuleExt } from "models";
import { PothosTagRule } from "#schema/TagRule.js";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { db, dTag, dTagCategory, dTagRule } from "server-db";

const dOtherTag = alias(dTag, "OtherTag");

const createTagRule = (b: typeof builder) =>
  b.mutationField("createTagRule", t =>
    t.field({
      type: PothosTagRule,
      args: {
        tagSlug: t.arg.string({ required: true }),
        ruleKind: t.arg.string({ required: true }),
        otherTagSlug: t.arg.string({ required: false }),
      },
      resolve: async (parent, { tagSlug, ruleKind, otherTagSlug }) => {
        const insertRes = await db
          .insert(dTagRule)
          .select(
            otherTagSlug
              ? db.select({
                  id: sql`null`.as("id"),
                  tagId: dTag.id,
                  ruleKind: sql<"implies" | "delete">`${ruleKind}`.as("ruleKind"),
                  otherTagId: dOtherTag.id,
                })
                  .from(dTag)
                  .leftJoin(dOtherTag, eq(dOtherTag.slug, otherTagSlug!))
                  .where(eq(dTag.slug, tagSlug))
              : db.select({
                  id: sql`null`.as("id"),
                  tagId: dTag.id,
                  ruleKind: sql<"implies" | "delete">`${ruleKind}`.as("ruleKind"),
                  otherTagId: sql`null`.as("otherTagId"),
                })
                  .from(dTag)
                  .where(eq(dTag.slug, tagSlug)),
          )
          .returning();

        const insertedRow = insertRes[0];
        if (!insertedRow) {
          return null;
        }

        const dOtherTagCategory = alias(dTagCategory, "OtherTagCategory");

        const res = await db
          .select()
          .from(dTagRule)
          .where(eq(dTagRule.id, insertedRow.id))
          .leftJoin(dTag, eq(dTagRule.tagId, dTag.id))
          .leftJoin(dOtherTag, eq(dTagRule.otherTagId, dOtherTag.id))
          .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug))
          .leftJoin(dOtherTagCategory, eq(dOtherTag.categorySlug, dOtherTagCategory.slug));

        const item = res[0];
        if (!item) {
          return null;
        }

        return {
          id: item.TagRule.id,
          kind: item.TagRule.ruleKind,
          tag: item.Tag!,
          tagSlug: item.Tag?.slug ?? tagSlug,
          otherTag: item.OtherTag ?? undefined,
          otherTagSlug: item.OtherTag?.slug ?? otherTagSlug ?? undefined,
        } satisfies TagRuleExt;
      },
    }));

export default createTagRule;
