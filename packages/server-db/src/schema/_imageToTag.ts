import { relations } from "drizzle-orm";
import { bigint, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { dImage } from "./image.js";
import { dTag } from "./tag.js";

export const d_ImageToTag = pgTable(
  "_ImageToTag",
  {
    imageId: bigint("imageId", { mode: "number" })
      .notNull()
      .references(() => dImage.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    tagId: bigint("tagId", { mode: "number" })
      .notNull()
      .references(() => dTag.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  table => ([
    primaryKey({
      name: "_ImageToTag_pkey",
      columns: [table.imageId, table.tagId],
    }),
  ]),
);

export const _ImageToTagRelations = relations(d_ImageToTag, ({ one }) => ({
  image: one(dImage, {
    fields: [d_ImageToTag.imageId],
    references: [dImage.id],
  }),
  tag: one(dTag, {
    fields: [d_ImageToTag.tagId],
    references: [dTag.id],
  }),
}));
