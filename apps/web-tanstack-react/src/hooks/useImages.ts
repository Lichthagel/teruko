import type { ImagesArgs, ImagesResult } from "client-graphql/snippets";
import type { ImageSort } from "models";
import type { CombinedError, OperationResult } from "urql";
import { Images } from "client-graphql/snippets";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRequest, useClient } from "urql";

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

type Edge = ImagesResult["images"]["edges"][number];

export const useImages = (
  tags: readonly string[],
  sort: ImageSort,
) => {
  const client = useClient();

  const [edges, setEdges] = useState<Edge[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const filtersChangedRef = useRef(true);

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<CombinedError>();

  const images = useMemo(() => edges.map(edge => edge.node), [edges]);

  const handleChange = useCallback((res: OperationResult<ImagesResult, ImagesArgs>): void => {
    if (res.data) {
      const usedCursor = res.operation.variables.last
        ? res.operation.variables.before
        : res.operation.variables.after;

      const { edges: newEdges, pageInfo } = res.data.images;

      setEdges((prevEdges: Edge[]): Edge[] => {
        if (newEdges.length > 0) {
          if (filtersChangedRef.current) {
            filtersChangedRef.current = false;
            return newEdges;
          } else if (usedCursor) {
            const idx = prevEdges.findIndex(edge => edge.cursor === usedCursor);

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
        return [];
      });

      setHasNextPage(res.operation.variables.last
        ? pageInfo.hasPreviousPage
        : pageInfo.hasNextPage);
    }

    setFetching(false);
    setError(res.error);
  }, []);

  const newQuery = useCallback((cursor?: string, refresh = false) => {
    // eslint-disable-next-line react/set-state-in-effect
    setFetching(true);

    client
      .executeQuery(getRequest(tags, sort, cursor), {
        requestPolicy: refresh ? "network-only" : "cache-first",
      })
      .toPromise()
      .then(handleChange)
      .catch((error) => {
        console.error(error);
      });
  }, [client, handleChange, sort, tags]);

  useEffect(() => {
    filtersChangedRef.current = true;
    newQuery();
  }, [newQuery]);

  const fetchMore = useCallback(() => {
    if (hasNextPage && !error) {
      newQuery(edges.at(-1)?.cursor, false);
    }
  }, [edges, error, hasNextPage, newQuery]);

  return { fetching, error, images, fetchMore };
};
