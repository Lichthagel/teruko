import { db, dTag, dTagCategory } from "../../db";
import { builder } from "../builder";
import { eq } from "drizzle-orm";
import { PothosTag } from "../Tag";

export default (b: typeof builder) =>
  b.queryField("tag", (t) =>
    t.field({
      type: PothosTag,
      nullable: true,
      args: {
        slug: t.arg.string({
          required: true,
        }),
      },
      resolve: async (parent, { slug }) => {
        const result = await db
          .select()
          .from(dTag)
          .where(eq(dTag.slug, slug))
          .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug))
          .limit(1);

        return result.length === 0
          ? null
          : {
              ...result[0].Tag,
              category: result[0].TagCategory,
            };
      },
    })
  );
