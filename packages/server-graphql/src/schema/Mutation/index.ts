import type { builder as schemaBuilder } from "../builder.js";

import createImage from "./createImage.js";
import createImageFromUrlBsky from "./createImageFromUrlBsky.js";
import createTagRule from "./createTagRule.js";
import updateTag from "./updateTag.js";

export const applyMutation = (builder: typeof schemaBuilder) => {
  createImage(builder);
  createImageFromUrlBsky(builder);
  createTagRule(builder);
  updateTag(builder);
};
