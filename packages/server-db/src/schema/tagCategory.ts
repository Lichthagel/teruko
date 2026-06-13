import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { dTag } from "./tag.js";

export const dTagCategory = pgTable("TagCategory", {
  slug: text("slug").primaryKey(),
  color: text("color"),
});

export const TagCategoryRelations = relations(dTagCategory, ({ many }) => ({
  tags: many(dTag),
}));
