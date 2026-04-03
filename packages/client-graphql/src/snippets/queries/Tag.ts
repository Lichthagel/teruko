import type { TagExt } from "models";
import { gql } from "@urql/core";

export type TagResult = { tag: TagExt };

export type TagArgs = { slug: string };

export const Tag = gql<TagResult, TagArgs>`
query Tag($slug: String!) {
  tag(slug: $slug) {
    category {
      color
    }
  }
}
`;
