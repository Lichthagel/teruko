import type { ImageExt } from "models";
import { gql } from "@urql/core";

export type ImagesResult = {
  images: {
    edges: {
      cursor: string;
      node: ImageExt;
    }[];
    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
};

export type ImagesArgs = {
  tags: readonly string[];
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  random?: boolean;
};

export const Images = gql<ImagesResult, ImagesArgs>`
query Images(
  $tags: [String!]
  $after: String
  $before: String
  $first: Int
  $last: Int
  $random: Boolean
) {
  images(
    tags: $tags
    after: $after
    before: $before
    first: $first
    last: $last
    random: $random
  ) {
    edges {
      cursor
      node {
        id
        title
        source
        filename
        createdAt
        updatedAt
        width
        height
        tags {
          slug
          category {
            color
          }
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
  }
}
`;
