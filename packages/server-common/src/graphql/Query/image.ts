import { asc, eq } from "drizzle-orm";
import { ImageExt } from "models";

import {
  dImage,
  dTag,
  dTagCategory,
  // eslint-disable-next-line perfectionist/sort-named-imports
  d_ImageToTag,
  db,
} from "../../db/index.js";
import { PothosImage } from "../Image.js";
import { builder } from "../builder.js";

const image = (b: typeof builder) =>
  b.queryField("image", (t) =>
    t.field({
      type: PothosImage,
      nullable: true,
      args: {
        id: t.arg.id({
          required: true,
        }),
      },
      resolve: async (parent, { id }) => {
        const result = await db
          .select()
          .from(dImage)
          .where(eq(dImage.id, id.toString()))
          .leftJoin(d_ImageToTag, eq(dImage.id, d_ImageToTag.A))
          .leftJoin(dTag, eq(d_ImageToTag.B, dTag.slug))
          .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug))
          .orderBy(asc(dTag.categorySlug), asc(dTag.slug));

        // Build object from the returned rows
        const reduced: ImageExt[] = [];

        for (const cur of result) {
          const last = reduced.at(-1);

          if (last === undefined || last.id !== cur.Image.id) {
            if (cur.Tag) {
              reduced.push({
                ...cur.Image,
                tags: [
                  {
                    ...cur.Tag,
                    category: cur.TagCategory,
                  },
                ],
              });
            } else {
              reduced.push({
                ...cur.Image,
                tags: [],
              });
            }
          } else {
            const tags = last.tags ?? [];

            if (cur.Tag) {
              tags.push({
                ...cur.Tag,
                category: cur.TagCategory,
              });
            }
          }
        }

        return reduced[0] ?? undefined;
      },
    }));

export default image;
