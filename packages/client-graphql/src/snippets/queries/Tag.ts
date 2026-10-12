import type { TagCategory, Tag as TagModel } from "models";
import { gql } from "@urql/core";

export type TagResult = { tag: Pick<TagModel, "slug" | "approved"> & { category: Pick<TagCategory, "color"> } };

export type TagArgs = { slug: string };

export const Tag = gql<TagResult, TagArgs>`
query Tag($slug: String!) {
  tag(slug: $slug) {
    slug
    approved
    category {
      color
    }
  }
}
`;
