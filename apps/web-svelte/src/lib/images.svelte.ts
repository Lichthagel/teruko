import type { CombinedError, OperationResult } from "@urql/svelte";
import type { ImagesArgs, ImagesResult } from "client-graphql/snippets";
import type { ImageSort } from "models";
import { browser } from "$app/environment";
import { createRequest, getContextClient } from "@urql/svelte";
import { Images } from "client-graphql/snippets";

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

export const useImages = (
  tags: () => readonly string[],
  sort: () => ImageSort,
) => {
  const client = getContextClient();

  let edges: ImagesResult["images"]["edges"] = $state([]);
  let hasNextPage = $state(true);

  let fetching = $state(false);
  let error = $state<CombinedError>();
  const images = $derived(edges.map(edge => edge.node));

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

    fetching = false;
    error = res.error;

    if (!res.error && !res.stale && sort() === "NEWEST") {
      resetTimeout();
    } else {
      cancelTimeout();
    }
  };

  const newQuery = (cursor?: string, refresh = false) => {
    fetching = true;

    client
      .executeQuery(getRequest(tags(), sort(), cursor), {
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

  $effect(() => {
    newQuery();

    return () => {
      cancelTimeout();
    };
  });

  const fetchMore = () => {
        if (hasNextPage && !error) {
          newQuery(edges.at(-1)?.cursor, false);
        }
      };

  return {
    get fetching() {
      return fetching;
    },
    get error() {
      return error;
    },
    get images() {
      return images;
    },
    fetchMore,
  };
};
