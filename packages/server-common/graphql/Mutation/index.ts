import { builder as schemaBuilder } from "../builder";
import createImage from "./createImage";

export const applyMutation = (builder: typeof schemaBuilder) => {
  createImage(builder);
};
