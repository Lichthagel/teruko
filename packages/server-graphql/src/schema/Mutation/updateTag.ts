import { eq } from "drizzle-orm";
import {
  // eslint-disable-next-line perfectionist/sort-named-imports
  dTag, d_ImageToTag, db,
} from "server-db";

import type { builder } from "../builder.js";

import { PothosTag } from "../Tag.js";

const updateTag = (b: typeof builder) => {
  b.mutationField("updateTag", (t) =>
    t.field({
      type: PothosTag,
      args: {
        slug: t.arg.string({
          required: true,
        }),
        newSlug: t.arg.string(),
        category: t.arg.string(),
      },
      resolve: async (parent, { slug, newSlug, category }) => {
        const rename = newSlug && newSlug !== slug;

        if (rename) {
          // TODO less requests, without non-null assertion
          const res = await db.transaction(async (tx) => {
            // get old tag
            const oldTagResult = await tx
              .select()
              .from(dTag)
              .where(eq(dTag.slug, slug));

            const oldTag = oldTagResult[0];

            if (!oldTag) {
              throw new Error("Tag not found");
            }

            // upsert new tag
            const newTagResult = await tx
              .insert(dTag)
              .values({
                slug: newSlug,
                categorySlug: category ?? oldTag.categorySlug,
              })
              .onConflictDoUpdate({
                target: dTag.slug,
                set: {
                  categorySlug: category ?? oldTag.categorySlug,
                },
              })
              .returning();

            const newTag = newTagResult[0];

            if (!newTag) {
              throw new Error("Could not create/return new tag");
            }

            // update all tag references
            const existing = await tx
              .delete(d_ImageToTag)
              .where(eq(d_ImageToTag.tagId, oldTag.id))
              .returning();

            await tx
              .insert(d_ImageToTag)
              .values(
                existing.map((e) => ({
                  imageId: e.imageId,
                  tagId: newTag.id,
                })),
              )
              .onConflictDoNothing();

            // delete old tag
            await tx.delete(dTag).where(eq(dTag.id, oldTag.id));

            return newTag;
          });

          return res;
        } else {
          const res = await db
            .update(dTag)
            .set({ categorySlug: category })
            .where(eq(dTag.slug, slug))
            .returning();

          const item = res[0];

          if (!item) {
            throw new Error("Tag not found");
          }

          return item;
        }
      },
    }));
};

export default updateTag;
