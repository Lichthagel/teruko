import { and, eq, inArray, not, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { d_ImageToTag, db, dTagRule } from "server-db";

export const applyTagRulesToImage = async (imageId: number) => {
  const resImplies = await db
    .insert(d_ImageToTag)
    .select(
      db
        .select(
          {
            imageId: sql`${imageId}`.as("imageId"),
            tagId: dTagRule.otherTagId,
          },
        )
        .from(dTagRule)
        .innerJoin(d_ImageToTag, and(
          eq(d_ImageToTag.tagId, dTagRule.tagId),
          eq(d_ImageToTag.imageId, imageId),
        ))
        .where(and(
          eq(dTagRule.ruleKind, "implies"),
          not(inArray(
            dTagRule.otherTagId,
            db.select({ tagId: d_ImageToTag.tagId }).from(d_ImageToTag).where(eq(d_ImageToTag.imageId, imageId)),
          )),
        )),
    )
    .returning();

  const resRemove = await db
    .delete(d_ImageToTag)
    .where(and(
      eq(d_ImageToTag.imageId, imageId),
      inArray(
        d_ImageToTag.tagId,
        db.select({ tagId: dTagRule.tagId }).from(dTagRule).where(eq(dTagRule.ruleKind, "remove")),
      ),
    ))
    .returning();

  return {
    removed: resRemove.map(row => row.tagId),
    added: resImplies.map(row => row.tagId),
  };
};

export const applyTagRulesAll = async () => {
  const dOther_ImageToTag = alias(d_ImageToTag, "Other_ImageToTag");

  const resImplies = await db
    .insert(d_ImageToTag)
    .select(
      db
        .select(
          {
            imageId: dOther_ImageToTag.imageId,
            tagId: dTagRule.otherTagId,
          },
        )
        .from(dTagRule)
        .innerJoin(dOther_ImageToTag, and(
          eq(dOther_ImageToTag.tagId, dTagRule.tagId),
        ))
        .where(and(
          eq(dTagRule.ruleKind, "implies"),
          not(inArray(
            dTagRule.otherTagId,
            db.select({ tagId: d_ImageToTag.tagId }).from(d_ImageToTag).where(eq(d_ImageToTag.imageId, dOther_ImageToTag.imageId)),
          )),
        )),
    );

  const resRemove = await db
    .delete(d_ImageToTag)
    .where(inArray(
      d_ImageToTag.tagId,
      db.select({ tagId: dTagRule.tagId }).from(dTagRule).where(eq(dTagRule.ruleKind, "remove")),
    ));

  return {
    removed: resRemove.rowsAffected,
    added: resImplies.rowsAffected,
  };
};
