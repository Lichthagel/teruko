import { builder as schemaBuilder } from "../builder";
import image from "./image";
import images from "./images";
import tag from "./tag";
import tagSuggestions from "./tagSuggestions";

export const applyQuery = (builder: typeof schemaBuilder) => {
  images(builder);
  image(builder);
  tag(builder);
  tagSuggestions(builder);
};
