/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { ImageExt, ImageSort } from "models";
import {
  useCallback, useEffect, useRef, useState,
} from "react";
import {
  CombinedError,
  createRequest,
  gql,
  GraphQLRequest,
  OperationResult,
  useClient,
} from "urql";

type ImagesArgs = {
  tags: string[];
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
};

type ImagesOperationResult = OperationResult<ImagesResult, ImagesArgs>;

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

const getRequest = (
  tags: string[],
  sort: ImageSort,
  cursor: string | null = null,
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
    },
  );

type RequestParams = {
  cursor?: string;
  refresh: boolean;
  tags: string[];
  sort: ImageSort;
};

const useImages = (tags: string[], sort: ImageSort) => {
  const client = useClient();

  const [fetching, setFetching] = useState(false);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<CombinedError>();

  const [edges, setEdges] = useState<ImagesResult["images"]["edges"]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [requestParams, setRequestParams] = useState<RequestParams>({
    cursor: undefined,
    refresh: false,
    tags,
    sort,
  });

  useEffect(() => {
    setFetching(false);
    setStale(false);
    setError(undefined);
    setEdges([]);
    setHasMore(true);
    setRequestParams({
      cursor: undefined,
      refresh: false,
      tags,
      sort,
    });
  }, [tags, sort]);

  const fetchMore = useCallback(() => {
    if (hasMore && !fetching && !error) {
      setRequestParams((prev) => ({
        ...prev,
        cursor: edges.at(-1)?.cursor,
        refresh: false,
      }));
    }
  }, [
    edges,
    error,
    fetching,
    hasMore,
  ]);

  const refresh = useCallback(() => {
    setRequestParams((prev) => ({ ...prev, cursor: undefined, refresh: true }));
  }, []);

  const timeoutId = useRef<ReturnType<typeof globalThis.setTimeout>>(null); // this runs in the browser...

  const cancelTimeout = useCallback(() => {
    if (timeoutId.current) {
      globalThis.clearTimeout(timeoutId.current);
    }
  }, [timeoutId]);

  const resetTimeout = useCallback(() => {
    cancelTimeout();

    if (sort === "NEWEST") {
      timeoutId.current = globalThis.setTimeout(refresh, 20_000);
    }
  }, [cancelTimeout, refresh, sort]);

  const handleChange = useCallback(
    (res: ImagesOperationResult): void => {
      if (res.data) {
        const usedCursor = res.operation.variables.last
          ? res.operation.variables.before
          : res.operation.variables.after;

        const { edges: newEdges, pageInfo } = res.data.images;

        setEdges((prevEdges) => {
          if (newEdges.length > 0) {
            if (usedCursor) {
              const idx = prevEdges.findIndex(
                (edge) => edge.cursor === usedCursor,
              );

              return [...prevEdges.slice(0, idx + 1), ...newEdges];
            } else {
              const idx = prevEdges.findIndex(
                (edge) => edge.cursor === newEdges.at(-1)?.cursor,
              );

              return idx === -1
                ? newEdges
                : [...newEdges, ...prevEdges.slice(idx + 1)];
            }
          }

          return prevEdges;
        });

        setHasMore(
          res.operation.variables.last
            ? pageInfo.hasPreviousPage
            : pageInfo.hasNextPage,
        );
      }

      setFetching(false);
      setStale(!!res.stale);
      setError(res.error);

      if (res.stale || res.error) {
        cancelTimeout();
      } else {
        resetTimeout();
      }
    },
    [cancelTimeout, resetTimeout],
  );

  useEffect(() => {
    if (requestParams) {
      const {
        cursor, refresh, sort, tags,
      } = requestParams;

      setFetching(true);
      setStale(false);

      client
        .executeQuery(getRequest(tags, sort, cursor), {
          requestPolicy: refresh ? "network-only" : "cache-first",
        })
        .toPromise()
        .then(handleChange)
        .catch((error: CombinedError) => {
          setFetching(false);
          setStale(false);
          setError(error);
        });
    } else {
      setFetching(false);
      setStale(false);
    }
  }, [client, handleChange, requestParams]);

  return {
    fetching,
    stale,
    error,
    images: edges.map((edge) => edge.node),
    fetchMore,
  };
};

export default useImages;
