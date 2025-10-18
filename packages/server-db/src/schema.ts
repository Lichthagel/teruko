import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const dImage = sqliteTable(
  "Image",
  {
    id: integer("id")
      .primaryKey({ autoIncrement: true }),
    filename: text("filename")
      .notNull()
      .unique(),
    title: text("title"),
    source: text("source"),
    createdAt: integer("createdAt", {
      mode: "timestamp",
    })
      .notNull()
      .default(sql`(unixepoch('now'))`),
    updatedAt: integer("updatedAt", {
      mode: "timestamp",
    })
      .notNull()
      .default(sql`(unixepoch('now'))`),
    height: integer("height").notNull(),
    width: integer("width").notNull(),
  },
  table => ({
    createdAtIdx: index("Image_createdAt_idx").on(table.createdAt),
  }),
);

export const ImageRelations = relations(dImage, ({ many }) => ({
  tags: many(d_ImageToTag),
}));

export const dTag = sqliteTable("Tag", {
  id: integer("id")
    .primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  categorySlug: text("categorySlug").references(() => dTagCategory.slug, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const TagRelations = relations(dTag, ({ one, many }) => ({
  images: many(d_ImageToTag),
  category: one(dTagCategory, {
    fields: [dTag.categorySlug],
    references: [dTagCategory.slug],
  }),
}));

export const dTagCategory = sqliteTable("TagCategory", {
  slug: text("slug").primaryKey(),
  color: text("color"),
});

export const TagCategoryRelations = relations(dTagCategory, ({ many }) => ({
  tags: many(dTag),
}));

export const d_ImageToTag = sqliteTable(
  "_ImageToTag",
  {
    imageId: integer("imageId")
      .notNull()
      .references(() => dImage.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    tagId: integer("tagId")
      .notNull()
      .references(() => dTag.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  table => ({
    pk: primaryKey({
      name: "_ImageToTag_pkey",
      columns: [table.imageId, table.tagId],
    }),
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
