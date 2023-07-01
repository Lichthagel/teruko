import { builder as schemaBuilder } from "../builder";
import image from "./image";
import images from "./images";

export const applyQuery = (builder: typeof schemaBuilder) => {
  images(builder);
  image(builder);
};
