import type { CombinedError, OperationResult } from "@urql/solid";
import type { ImagesArgs, ImagesResult } from "client-graphql/snippets";
import type { ImageSort } from "models";
import type { Accessor } from "solid-js";
import { createRequest, useClient } from "@urql/solid";
import { Images } from "client-graphql/snippets";
import { createEffect, createMemo, createSignal } from "solid-js";

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

  const [cursor, setCursor] = createSignal<string>();
  const [fetching, setFetching] = createSignal(false);
  const [error, setError] = createSignal<CombinedError>();

  const [edges, setEdges] = createSignal<ImagesResult["images"]["edges"]>();
  const [hasNextPage, setHasNextPage] = createSignal(true);

  const images = createMemo(() => edges()?.map(edge => edge.node) ?? []);

  const handleResult = (result: OperationResult<ImagesResult, ImagesArgs>) => {
    if (result.data) {
      const usedCursor = result.operation.variables.last
        ? result.operation.variables.before
        : result.operation.variables.after;

      const { edges: newEdges, pageInfo } = result.data.images;

      if (newEdges.length > 0) {
        if (usedCursor) {
          setEdges(prev => [...(prev ?? []), ...newEdges]);
        } else {
          setEdges((prev) => {
            const idx = prev?.findIndex(edge => edge.cursor === newEdges.at(-1)?.cursor) ?? -1;

            return idx === -1 ? newEdges : [...newEdges, ...(prev?.slice(idx + 1) ?? [])];
          });
        }
      }

      setHasNextPage(result.operation.variables.last ? pageInfo.hasPreviousPage : pageInfo.hasNextPage);
    }

    setError(result.error);
  };

  createEffect(() => {
    setFetching(true);

    client
      .executeQuery(getRequest(tags(), sort(), cursor()))
      .toPromise()
      .then(handleResult)
      .catch(error => console.error(error))
      .finally(() => setFetching(false));
  });

  createEffect(() => {
    tags();
    sort();

    setEdges([]);
  });

  const fetchMore = () => {
    if (hasNextPage() && !error()) {
      setCursor(edges()?.at(-1)?.cursor);
    }
  };

  return { images, fetching, error, fetchMore };
};
