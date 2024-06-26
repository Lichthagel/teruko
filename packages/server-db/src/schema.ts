/* eslint-disable no-use-before-define */
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const dImage = pgTable(
  "Image",
  {
    id: text("id").primaryKey(),
    filename: text("filename").notNull(),
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
  slug: text("slug").primaryKey(),
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
    A: text("A")
      .notNull()
      .references(() => dImage.id),
    B: text("B")
      .notNull()
      .references(() => dTag.slug),
  },
  (table) => ({
    pk: primaryKey(table.A, table.B),
  }),
);

export const _ImageToTagRelations = relations(d_ImageToTag, ({ one }) => ({
  image: one(dImage, {
    fields: [d_ImageToTag.A],
    references: [dImage.id],
  }),
  tag: one(dTag, {
    fields: [d_ImageToTag.B],
    references: [dTag.slug],
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
