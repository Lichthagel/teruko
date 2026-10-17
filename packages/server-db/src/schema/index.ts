import { _ImageToTagRelations, d_ImageToTag } from "./_imageToTag.js";
import { dAuthSession, dUserToken } from "./auth.js";
import { dImage, ImageRelations } from "./image.js";
import { dTag, TagRelations } from "./tag.js";
import { dTagCategory, TagCategoryRelations } from "./tagCategory.js";

export { _ImageToTagRelations, d_ImageToTag } from "./_imageToTag.js";
export { dAuthSession, dUserToken } from "./auth.js";
export { dImage, ImageRelations } from "./image.js";
export { dTag, TagRelations } from "./tag.js";
export { dTagCategory, TagCategoryRelations } from "./tagCategory.js";

const schema = {
  Image: dImage,
  ImageRelations,
  Tag: dTag,
  TagRelations,
  TagCategory: dTagCategory,
  TagCategoryRelations,
  _ImageToTag: d_ImageToTag,
  _ImageToTagRelations,
  AuthSession: dAuthSession,
  UserToken: dUserToken,
};

export default schema;
