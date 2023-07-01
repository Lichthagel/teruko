/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Client,
  CombinedError,
  createRequest,
  gql,
  type GraphQLRequest,
  type OperationResult,
} from "@urql/svelte";
import type { ImageExt, ImageSort } from "./models";
import { writable, type Readable } from "svelte/store";
import { browser } from "$app/environment";

type ImagesResult = {
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

type ImagesArgs = {
  tags: string[];
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
};

type ImagesOperationResult = OperationResult<ImagesResult, ImagesArgs>;

const getRequest = (
  tags: string[],
  sort: ImageSort,
  cursor: string | null = null
): GraphQLRequest<ImagesResult, ImagesArgs> =>
  createRequest(
    gql`
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
    `,
    {
      tags,
      after: sort === "NEWEST" || sort === "RANDOM" ? cursor : null,
      before: sort === "OLDEST" ? cursor : null,
      first: sort === "NEWEST" || sort === "RANDOM" ? 20 : null,
      last: sort === "OLDEST" ? 20 : null,
      random: sort === "RANDOM",
    }
  );

type Result = {
  fetching: boolean;
  stale: boolean;
  error: CombinedError | undefined;
  images: ImageExt[];
  fetchMore: () => void;
};

const initialResult: Result = {
  fetching: false,
  stale: false,
  error: undefined,
  images: [],
  fetchMore: () => {},
};

export default (
  client: Client,
  tags: string[],
  sort: ImageSort
): Readable<Result> => {
  let edges: ImagesResult["images"]["edges"] = [];

  let hasNextPage = true;

  const handleChange = (res: ImagesOperationResult): void => {
    if (res.data) {
      const usedCursor = res.operation.variables.last
        ? res.operation.variables.before
        : res.operation.variables.after;

      const { edges: newEdges, pageInfo } = res.data.images;

      if (newEdges.length > 0) {
        if (usedCursor) {
          edges = [...edges, ...newEdges];
        } else {
          const idx = edges.findIndex(
            (edge) => edge.cursor === newEdges.at(-1)?.cursor
          );

          edges =
            idx === -1 ? newEdges : [...newEdges, ...edges.slice(idx + 1)];
        }
      }

      hasNextPage = res.operation.variables.last
        ? pageInfo.hasPreviousPage
        : pageInfo.hasNextPage;
    }

    result.set({
      fetching: false,
      stale: res.stale,
      error: res.error,
      images: edges.map((edge) => edge.node),
      fetchMore:
        hasNextPage && !res.error
          ? () => {
              newQuery(edges.at(-1)?.cursor, false);
            }
          : () => {},
    });

    if (!res.error && !res.stale && sort === "NEWEST") resetTimeout();
    else cancelTimeout();
  };

  const newQuery = (cursor?: string, refresh = false) => {
    result.set({
      fetching: true,
      stale: false,
      error: undefined,
      images: edges.map((edge) => edge.node),
      fetchMore: () => {},
    });

    client
      .executeQuery(getRequest(tags, sort, cursor), {
        requestPolicy: refresh ? "network-only" : "cache-first",
      })
      .toPromise()
      .then(handleChange)
      .catch((error) => {
        console.error(error);
      });
  };

  const refresh = () => {
    newQuery(undefined, true);
  };

  let timeoutId: number | undefined;

  const cancelTimeout = () => {
    if (!browser) return;

    if (timeoutId) window.clearTimeout(timeoutId);
  };

  const resetTimeout = () => {
    if (!browser) return;

    cancelTimeout();

    timeoutId = window.setTimeout(refresh, 20_000);
  };

  const result = writable<Result>(initialResult, () => {
    newQuery();
    return () => {
      cancelTimeout();
    };
  });

  return result;
};
