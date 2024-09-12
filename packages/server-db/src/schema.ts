/* eslint-disable no-use-before-define */
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const dImage = pgTable(
  "Image",
  {
    id: serial("id").primaryKey(),
    filename: text("filename").notNull()
      .unique(),
    title: text("title"),
    source: text("source"),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow(),
    height: integer("height").notNull(),
    width: integer("width").notNull(),
  },
  (table) => ({
    createdAtIdx: index("Image_createdAt_idx").using(
      "btree",
      table.createdAt.desc().nullsLast(),
    ),
  }),
);

export const ImageRelations = relations(dImage, ({ many }) => ({
  tags: many(d_ImageToTag),
}));

export const dTag = pgTable("Tag", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull()
    .unique(),
  categorySlug: text("categorySlug").references(() => dTagCategory.slug),
});

export const TagRelations = relations(dTag, ({ one, many }) => ({
  images: many(d_ImageToTag),
  category: one(dTagCategory, {
    fields: [dTag.categorySlug],
    references: [dTagCategory.slug],
  }),
}));

export const dTagCategory = pgTable("TagCategory", {
  slug: text("slug").primaryKey(),
  color: text("color"),
});

export const TagCategoryRelations = relations(dTagCategory, ({ many }) => ({
  tags: many(dTag),
}));

export const d_ImageToTag = pgTable(
  "_ImageToTag",
  {
    imageId: integer("imageId")
      .notNull()
      .references(() => dImage.id),
    tagId: integer("tagId")
      .notNull()
      .references(() => dTag.id),
  },
  (table) => ({
    pk: primaryKey(table.imageId, table.tagId),
  }),
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

const schema = {
  Image: dImage,
  ImageRelations,
  Tag: dTag,
  TagRelations,
  TagCategory: dTagCategory,
  TagCategoryRelations,
  _ImageToTag: d_ImageToTag,
  _ImageToTagRelations,
};

export default schema;
