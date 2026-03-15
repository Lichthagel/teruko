import type { Tag, TagRuleExt } from "models";
import { eq } from "drizzle-orm";
import { db, dTag } from "server-db";
import { builder } from "./builder.js";
import { PothosTag } from "./Tag.js";

export const PothosTagRule = builder.objectRef<TagRuleExt>("TagRule");

builder.node(PothosTagRule, {
  id: {
    resolve: parent => parent.id,
  },
  fields: t => ({
    tag: t.field({
      type: PothosTag,
      resolve: async (parent): Promise<Tag> => {
        if (parent.tag) {
          return parent.tag;
        }

        const res = await db
          .select()
          .from(dTag)
          .where(eq(dTag.slug, parent.tagSlug))
          .limit(1);

        return res[0]!;
      },
    }),
    kind: t.exposeString("kind"),
    otherTag: t.field({
      type: PothosTag,
      nullable: true,
      resolve: async (parent): Promise<Tag | undefined> => {
        if (!parent.otherTagSlug) {
          return;
        }

        if (parent.otherTag) {
          return parent.otherTag;
        }

        const res = await db
          .select()
          .from(dTag)
          .where(eq(dTag.slug, parent.otherTagSlug))
          .limit(1);

        return res[0]!;
      },
    }),
  }),
});
