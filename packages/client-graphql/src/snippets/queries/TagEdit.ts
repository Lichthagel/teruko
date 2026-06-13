import type { Tag, TagCategory } from "models";
import { gql } from "@urql/core";

export type TagEditResult = {
  tag?: Pick<Tag, "slug" | "approved"> & { category?: Pick<TagCategory, "slug" | "color"> };
  tagCategories: TagCategory[];
};

export type TagEditArgs = { slug: string };

export const TagEdit = gql<TagEditResult, TagEditArgs>`
query TagEdit($slug: String!) {
  tag(slug: $slug) {
    slug
    approved
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
