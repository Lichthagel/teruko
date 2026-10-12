import { relations } from "drizzle-orm";
import { bigint, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { d_ImageToTag } from "./_imageToTag.js";

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
