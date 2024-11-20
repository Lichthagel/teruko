import { asc, eq } from "drizzle-orm";
import { ImageExt } from "models";
import {
  d_ImageToTag,
  db,
  dImage,
  dTag,
  dTagCategory,
} from "server-db";

import type { builder } from "../builder.js";

import { PothosImage } from "../Image.js";

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
          .where(eq(dImage.id, Number.parseInt(id)))
          .leftJoin(d_ImageToTag, eq(dImage.id, d_ImageToTag.imageId))
          .leftJoin(dTag, eq(d_ImageToTag.tagId, dTag.id))
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
