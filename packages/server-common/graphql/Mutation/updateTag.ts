import { eq } from "drizzle-orm";
import { dTag, d_ImageToTag, db } from "../../db";
import { PothosTag } from "../Tag";
import { builder } from "../builder";

export default (b: typeof builder) => {
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
        const rename: boolean =
          newSlug !== undefined && newSlug !== null && newSlug !== slug;

        if (rename) {
          // TODO less requests, without non-null assertion
          const res = await db.transaction(async (tx) => {
            // get old tag
            const oldTag = await tx
              .select()
              .from(dTag)
              .where(eq(dTag.slug, slug));

            if (oldTag.length === 0) {
              throw new Error("Tag not found");
            }

            // upsert new tag
            const newTag = await tx
              .insert(dTag)
              .values({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                slug: newSlug!,
                categorySlug: category ?? oldTag[0].categorySlug,
              })
              .onConflictDoUpdate({
                target: dTag.slug,
                set: {
                  categorySlug: category ?? oldTag[0].categorySlug,
                },
              })
              .returning();

            // update all tag references
            const existing = await tx
              .delete(d_ImageToTag)
              .where(eq(d_ImageToTag.B, slug))
              .returning();

            await tx
              .insert(d_ImageToTag)
              .values(
                existing.map((e) => ({
                  A: e.A,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  B: newSlug!,
                })),
              )
              .onConflictDoNothing();

            // delete old tag
            await tx.delete(dTag).where(eq(dTag.slug, slug));

            return newTag[0];
          });

          return res;
        } else {
          const res = await db
            .update(dTag)
            .set({ categorySlug: category })
            .where(eq(dTag.slug, slug))
            .returning();

          if (res.length === 0) {
            throw new Error("Tag not found");
          }

          return res[0];
        }
      },
    }),
  );
};
