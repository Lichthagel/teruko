import { relations } from "drizzle-orm";
import { bigint, pgTable, text } from "drizzle-orm/pg-core";
import { d_ImageToTag } from "./_imageToTag.js";
import { dTagCategory } from "./tagCategory.js";

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
