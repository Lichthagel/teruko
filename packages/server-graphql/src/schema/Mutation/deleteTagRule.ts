import type { builder } from "#schema/builder.js";
import { eq } from "drizzle-orm";
import { db, dTagRule } from "server-db";

const deleteTagRule = (b: typeof builder) =>
  b.mutationField("deleteTagRule", t =>
    t.field({
      type: "Boolean",
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (parent, { id }) => {
        const res = await db
          .delete(dTagRule)
          .where(eq(dTagRule.id, id));

        return res.rowsAffected > 0;
      },
    }));

export default deleteTagRule;
