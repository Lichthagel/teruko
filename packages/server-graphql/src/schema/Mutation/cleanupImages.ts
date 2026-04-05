import type { builder } from "#schema/builder.js";
import { applyTagRulesAll } from "#lib/applyTagRules.js";

const cleanupImages = (b: typeof builder) =>
  b.mutationField("cleanupImages", t =>
    t.field({
      type: "String",
      args: {},
      resolve: async () => {
        const res = await applyTagRulesAll();

        return `added: ${res.added} — removed: ${res.removed}`;
      },
    }));

export default cleanupImages;
