import type { builder as schemaBuilder } from "../builder.js";

import image from "./image.js";
import images from "./images.js";
import tag from "./tag.js";
import tagSuggestions from "./tagSuggestions.js";

export const applyQuery = (builder: typeof schemaBuilder) => {
  images(builder);
  image(builder);
  tag(builder);
  tagSuggestions(builder);
};
