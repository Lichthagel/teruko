/* eslint-disable promise/prefer-await-to-then */
import {
  CombinedError,
  OperationResult,
  createRequest,
  gql,
  useClientHandle,
} from "@urql/vue";
import { ImageExt, ImageSort } from "models";

type ImagesResult = {
  images: {
    edges: {
      node: ImageExt;
      cursor: string;
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
  tags: readonly string[];
  after?: string;
  before?: string;
  first?: number;
  last?: number;
};

type ImagesOperationResult = OperationResult<ImagesResult, ImagesArgs>;

const getRequest = (
  tags: readonly string[],
  sort: ImageSort,
  cursor?: string
) =>
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
      after: sort === "NEWEST" || sort === "RANDOM" ? cursor : undefined,
      before: sort === "OLDEST" ? cursor : undefined,
      first: sort === "NEWEST" || sort === "RANDOM" ? 20 : undefined,
      last: sort === "OLDEST" ? 20 : undefined,
      random: sort === "RANDOM" ? true : undefined,
    }
  );

export const useImages = (
  tags: Ref<readonly string[]>,
  sort: Ref<ImageSort>
) => {
  const clientHandle = useClientHandle();

  const fetching = ref(false);
  const stale = ref(false);
  const error = ref<CombinedError>();

  const edges = ref<ImagesResult["images"]["edges"]>([]);
  const hasNextPage = ref(true);

  const handleChange = (res: ImagesOperationResult): void => {
    if (res.data) {
      const usedCursor = res.operation.variables.last
        ? res.operation.variables.before
        : res.operation.variables.after;

      const { edges: newEdges, pageInfo } = res.data.images;

      edges.value = ((prevEdges) => {
        if (newEdges.length > 0) {
          if (usedCursor) {
            const idx = prevEdges.findIndex(
              (edge) => edge.cursor === usedCursor
            );

            return [...prevEdges.slice(0, idx + 1), ...newEdges];
          } else {
            const idx = prevEdges.findIndex(
              (image) => image.cursor === newEdges.at(-1)?.cursor
            );

            return idx === -1
              ? newEdges
              : [...newEdges, ...prevEdges.slice(idx + 1)];
          }
        }

        return prevEdges;
      })(edges.value);

      hasNextPage.value = res.operation.variables.last
        ? pageInfo.hasPreviousPage
        : pageInfo.hasNextPage;
    }

    fetching.value = false;
    stale.value = !!res.stale;
    error.value = res.error;

    if (res.stale || res.error) {
      cancelTimeout();
    } else {
      resetTimeout();
    }
  };

  const newQuery = (cursor?: string, refresh = false) => {
    stale.value = false;
    fetching.value = true;
    error.value = undefined;

    clientHandle.client
      .executeQuery(getRequest(tags.value, sort.value, cursor), {
        requestPolicy: refresh ? "network-only" : "cache-first",
      })
      .toPromise()
      .then(handleChange)
      .catch((error) => {
        error.value = error;
      });
  };

  const fetchMore = () => {
    if (!fetching.value && !error.value && hasNextPage.value) {
      newQuery(edges.value.at(-1)?.cursor);
    }
  };

  const refresh = () => {
    newQuery(undefined, true);
  };

  const timeoutId = ref<number | undefined>();

  const cancelTimeout = () => {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = undefined;
  };

  const resetTimeout = () => {
    window.clearTimeout(timeoutId.value);

    if (!fetching.value && !stale.value && sort.value === "NEWEST") {
      timeoutId.value = window.setTimeout(refresh, 20_000);
    }
  };

  onMounted(() => newQuery());

  onBeforeUnmount(() => clearTimeout(timeoutId.value));

  watch(fetching, resetTimeout);
  watch(stale, resetTimeout);

  watch(tags, () => newQuery());
  watch(sort, () => newQuery());

  return {
    images: computed(() => edges.value.map((edge) => edge.node)),
    fetching,
    error,
    stale,
    fetchMore,
  };
};
