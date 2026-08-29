import { relations } from "drizzle-orm";
import { bigint, index, pgTable, text } from "drizzle-orm/pg-core";
import { dTag } from "./tag";

export const dTagAlias = pgTable(
  "TagAlias",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    tagId: bigint("tagId", { mode: "number" })
      .notNull()
      .references(() => dTag.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    alias: text("alias")
      .notNull()
      .unique(),
  },
  table => ([
    index("TagAlias_alias_idx").on(table.alias),
  ]),
);

export const TagAliasRelations = relations(dTagAlias, ({ one }) => ({
  tag: one(dTag, {
    fields: [dTagAlias.tagId],
    references: [dTag.id],
  }),
}));
