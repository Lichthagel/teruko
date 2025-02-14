import { eq } from "drizzle-orm";
import { type ImageExt } from "models";
import {
  // eslint-disable-next-line perfectionist/sort-named-imports
  dImage, dTag, dTagCategory, d_ImageToTag, db,
} from "server-db";

import { builder } from "./builder.js";
import { PothosTag } from "./Tag.js";

export const PothosImage = builder.objectRef<ImageExt>("Image");

builder.node(PothosImage, {
  id: {
    resolve: (parent) => parent.id,
  },
  loadOne: async (id) => {
    const res = await db
      .select()
      .from(dImage)
      .where(eq(dImage.id, Number.parseInt(id.replace("Image_", ""))));

    return res[0];
  },
  fields: (t) => ({
    id: t.exposeID("id"),
    filename: t.exposeString("filename"),
    title: t.exposeString("title", { nullable: true }),
    source: t.exposeString("source", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    height: t.exposeInt("height"),
    width: t.exposeInt("width"),
    tags: t.field({
      type: [PothosTag],
      resolve: async (parent) => {
        if (parent.tags !== undefined) {
          return parent.tags;
        }

        const res = await db
          .select()
          .from(dTag)
          .innerJoin(d_ImageToTag, eq(dTag.id, d_ImageToTag.tagId))
          .where(eq(d_ImageToTag.imageId, parent.id))
          .orderBy(dTag.categorySlug, dTag.slug)
          .leftJoin(dTagCategory, eq(dTagCategory.slug, dTag.categorySlug));

        return res.map((row) => ({
          ...row.Tag,
          category: row.TagCategory,
        }));
      },
    }),
  }),
});
