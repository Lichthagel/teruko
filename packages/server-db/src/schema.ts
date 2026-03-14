import { relations } from "drizzle-orm";
import { bigint, index, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const dImage = pgTable(
  "Image",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    filename: text("filename")
      .notNull()
      .unique(),
    title: text("title"),
    source: text("source"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .notNull()
      .defaultNow(),
    height: integer("height").notNull(),
    width: integer("width").notNull(),
  },
  table => (
    [index("Image_createdAt_idx").on(table.createdAt)]
  ),
);

export const ImageRelations = relations(dImage, ({ many }) => ({
  tags: many(d_ImageToTag),
}));

export const dTag = pgTable("Tag", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
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

export const dTagRule = sqliteTable(
  "TagRule",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tagId: integer("tagId").notNull().references(() => dTag.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    ruleKind: text("ruleKind", { enum: ["implies", "delete"] }).notNull(),
    otherTagId: integer("otherTagId").references(() => dTag.id, {
      onDelete: "no action",
      onUpdate: "cascade",
    }),
  },
  table => ({
    otherTagIdIdx: index("TagRule_otherTagId_idx").on(table.otherTagId),
  }),
);

export const TagRuleRelations = relations(dTagRule, ({ one }) => ({
  tag: one(dTag, {
    fields: [dTagRule.tagId],
    references: [dTag.id],
  }),
  otherTag: one(dTag, {
    fields: [dTagRule.otherTagId],
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
  TagRule: dTagRule,
  TagRuleRelations,
};

export default schema;
