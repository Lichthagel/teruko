import type { Tag, TagCategory } from "models";
import { gql } from "@urql/core";

export type UpdateTagResult = {
  updateTag: Pick<Tag, "slug" | "approved">
    & { category?: Pick<TagCategory, "slug"> };
};

export type UpdateTagArgs = {
  slug: string;
  newSlug?: string;
  category?: string;
  approved?: boolean;
};

export const UpdateTag = gql<UpdateTagResult, UpdateTagArgs>`
mutation UpdateTag(
  $slug: String!
  $newSlug: String
  $category: String
  $approved: Boolean
) {
  updateTag(
    slug: $slug
    newSlug: $newSlug
    category: $category
    approved: $approved
  ) {
    slug
    approved
    category {
      slug
    }
  }
}

`;
