import { builder as schemaBuilder } from "../builder";
import createImage from "./createImage";
import updateTag from "./updateTag";

export const applyMutation = (builder: typeof schemaBuilder) => {
  createImage(builder);
  updateTag(builder);
};
