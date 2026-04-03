import type { TagExt } from "models";
import { gql } from "@urql/core";

export type TagSuggestionsResult = { tagSuggestions: TagExt[] };

export type TagSuggestionsArgs = { query: string };

export const TagSuggestions = gql<TagSuggestionsResult, TagSuggestionsArgs>`
query TagSuggestions($query: String!) {
  tagSuggestions(query: $query) {
    slug
    category {
      color
    }
  }
}
`;
