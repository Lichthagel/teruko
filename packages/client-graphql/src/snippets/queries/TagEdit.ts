import type { TagCategory, TagExt } from "models";
import { gql } from "@urql/core";

export type TagEditResult = { tag?: TagExt; tagCategories: TagCategory[] };

export type TagEditArgs = { slug: string };

export const TagEdit = gql<TagEditResult, TagEditArgs>`
query TagEdit($slug: String!) {
  tag(slug: $slug) {
    slug
    category {
      _id
      slug
      color
    }
  }        
  tagCategories {
    _id
    color
    slug
  }
}
`;
