import type { builder } from "#schema/builder.js";
import { applyTagRulesToImage } from "#lib/applyTagRules.js";

const cleanupImage = (b: typeof builder) =>
  b.mutationField("cleanupImage", t =>
    t.field({
      type: "String",
      args: {
        imageId: t.arg.int({ required: true }),
      },
      resolve: async (parent, { imageId }) => {
        const res = await applyTagRulesToImage(imageId);

        return `added: ${res.added.join(", ")} — removed: ${res.removed.join(", ")}`;
      },
    }));

export default cleanupImage;
