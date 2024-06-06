import { builder as schemaBuilder } from "../builder.js";
import createImage from "./createImage.js";
import updateTag from "./updateTag.js";

export const applyMutation = (builder: typeof schemaBuilder) => {
  createImage(builder);
  updateTag(builder);
};
