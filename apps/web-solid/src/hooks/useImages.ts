import type { CombinedError, OperationResult } from "@urql/solid";
import type { ImagesArgs, ImagesResult } from "client-graphql/snippets";
import type { ImageSort } from "models";
import type { Accessor } from "solid-js";
import { createRequest, useClient } from "@urql/solid";
import { Images } from "client-graphql/snippets";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

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

export const useImages = (tags: Accessor<readonly string[]>, sort: Accessor<ImageSort>) => {
  const client = useClient();

  const [fetching, setFetching] = createSignal(false);
  const [error, setError] = createSignal<CombinedError>();

  const [edges, setEdges] = createSignal<ImagesResult["images"]["edges"]>([]);
  const [hasNextPage, setHasNextPage] = createSignal(true);
  let filtersChanged = true;

  const images = createMemo(() => edges()?.map(edge => edge.node) ?? []);

  const handleResult = (result: OperationResult<ImagesResult, ImagesArgs>) => {
    if (result.data) {
      const usedCursor = result.operation.variables.last
        ? result.operation.variables.before
        : result.operation.variables.after;

      const { edges: newEdges, pageInfo } = result.data.images;

      setEdges((prevEdges) => {
        if (newEdges.length > 0) {
          if (filtersChanged) {
            filtersChanged = false;
            return newEdges;
          }

          if (usedCursor) {
            const idx = prevEdges.findIndex(
              edge => edge.cursor === usedCursor,
            );

            if (idx >= 0) {
              const previousKept = prevEdges.slice(0, idx + 1);
              const filteredNewEdges = newEdges.filter(edge => !previousKept.some(prev => prev.node.id === edge.node.id));

              return [...previousKept, ...filteredNewEdges];
            } else {
              return newEdges;
            }
          } else {
            const idx = prevEdges.findIndex(
              image => image.cursor === newEdges.at(-1)?.cursor,
            );

            return idx === -1
              ? newEdges
              : [...newEdges, ...prevEdges.slice(idx + 1)];
          }
        }

        return prevEdges;
      });

      setHasNextPage(result.operation.variables.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage);
    }

    setFetching(false);
    setError(result.error);

    if (!result.error && !result.stale && sort() === "NEWEST") {
      resetTimeout();
    } else {
      cancelTimeout();
    }
  };

  const newQuery = (cursor?: string, refresh = false) => {
    setFetching(true);
    setError(undefined);

    client
      .executeQuery(getRequest(tags(), sort(), cursor), {
        requestPolicy: refresh ? "network-only" : "cache-first",
      })
      .toPromise()
      .then(handleResult)
      .catch(setError);
  };

  const refresh = () => {
    newQuery(undefined, true);
  };

  const [timeoutId, setTimeoutId] = createSignal<ReturnType<typeof globalThis.setTimeout>>();

  const cancelTimeout = () => {
    if (timeoutId()) {
      globalThis.clearTimeout(timeoutId());
    }
  };

  const resetTimeout = () => {
    cancelTimeout();

    setTimeoutId(globalThis.setTimeout(refresh, 20_000));
  };

  createEffect(() => {
    filtersChanged = true;
    newQuery();
  });

  onCleanup(() => {
    cancelTimeout();
  });

  const fetchMore = () => {
    if (hasNextPage() && !error()) {
      newQuery(edges().at(-1)?.cursor, false);
    }
  };

  return { images, fetching, error, fetchMore };
};
