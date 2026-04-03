import type { Client, CombinedError, OperationResult } from "@urql/svelte";
import type { ImagesArgs, ImagesResult } from "client-graphql/snippets";
import type { ImageExt, ImageSort } from "models";
import type { Readable } from "svelte/store";
import { browser } from "$app/environment";
import { createRequest } from "@urql/svelte";
import { Images } from "client-graphql/snippets";
import { writable } from "svelte/store";

const getRequest = (
  tags: readonly string[],
  sort: ImageSort,
  cursor: string | null = null,
) =>
  createRequest(
    Images,
    {
      tags,
      after: sort === "NEWEST" || sort === "RANDOM" ? cursor : null,
      before: sort === "OLDEST" ? cursor : null,
      first: sort === "NEWEST" || sort === "RANDOM" ? 20 : null,
      last: sort === "OLDEST" ? 20 : null,
      random: sort === "RANDOM",
    },
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

const imagesStore = (
  client: Client,
  tags: readonly string[],
  sort: ImageSort,
): Readable<Result> => {
  let edges: ImagesResult["images"]["edges"] = [];

  let hasNextPage = true;

  const handleChange = (res: OperationResult<ImagesResult, ImagesArgs>): void => {
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
            edge => edge.cursor === newEdges.at(-1)?.cursor,
          );

          edges
            = idx === -1 ? newEdges : [...newEdges, ...edges.slice(idx + 1)];
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
      images: edges.map(edge => edge.node),
      fetchMore:
        hasNextPage && !res.error
          ? () => {
              newQuery(edges.at(-1)?.cursor, false);
            }
          : () => {},
    });

    if (!res.error && !res.stale && sort === "NEWEST") {
      resetTimeout();
    } else {
      cancelTimeout();
    }
  };

  const newQuery = (cursor?: string, refresh = false) => {
    result.set({
      fetching: true,
      stale: false,
      error: undefined,
      images: edges.map(edge => edge.node),
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

  let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

  const cancelTimeout = () => {
    if (!browser) {
      return;
    }

    if (timeoutId) {
      globalThis.clearTimeout(timeoutId);
    }
  };

  const resetTimeout = () => {
    if (!browser) {
      return;
    }

    cancelTimeout();

    timeoutId = globalThis.setTimeout(refresh, 20_000);
  };

  const result = writable<Result>(initialResult, () => {
    newQuery();
    return () => {
      cancelTimeout();
    };
  });

  return result;
};

export default imagesStore;
