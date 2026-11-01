import { relations } from "drizzle-orm";
import { bigint, index, pgTable, text } from "drizzle-orm/pg-core";
import { dTag } from "./tag.js";

export const dTagRule = pgTable(
  "TagRule",
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
    ruleKind: text("ruleKind", { enum: ["implies", "remove"] })
      .notNull(),
    otherTagId: bigint("otherTagId", { mode: "number" })
      .references(() => dTag.id, {
        onDelete: "no action",
        onUpdate: "cascade",
      }),
  },
  table => ([
    index("TagRule_otherTagId_idx").on(table.otherTagId),
  ]),
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
