import type { ImageExt } from "models";
import { gql } from "@urql/core";

export type ImageResult = { image: ImageExt | null };

export type ImageArgs = { id: number };

export const Image = gql<ImageResult, ImageArgs>`
      query Image($id: ID!) {
        image(id: $id) {
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
    `;
