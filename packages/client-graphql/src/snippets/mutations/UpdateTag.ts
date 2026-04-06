import type { TagExt } from "models";
import { gql } from "@urql/core";

export type UpdateTagResult = { updateTag: TagExt };

export type UpdateTagArgs = { slug: string; newSlug?: string; category?: string };

export const UpdateTag = gql<UpdateTagResult, UpdateTagArgs>`
mutation UpdateTag($slug: String!, $newSlug: String, $category: String) {
  updateTag(slug: $slug, newSlug: $newSlug, category: $category) {
    slug
    category {
      slug
    }
  }
}
`;
