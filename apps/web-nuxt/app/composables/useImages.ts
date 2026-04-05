import type { CombinedError, OperationResult } from "@urql/vue";
import type { ImagesArgs, ImagesResult } from "client-graphql/snippets";
import type { ImageSort } from "models";
import {
  createRequest,
  useClientHandle,
} from "@urql/vue";
import { Images } from "client-graphql/snippets";

const getRequest = (
  tags: readonly string[],
  sort: ImageSort,
  cursor?: string,
) =>
  createRequest(
    Images,
    {
      tags,
      after: sort === "NEWEST" || sort === "RANDOM" ? cursor : undefined,
      before: sort === "OLDEST" ? cursor : undefined,
      first: sort === "NEWEST" || sort === "RANDOM" ? 20 : undefined,
      last: sort === "OLDEST" ? 20 : undefined,
      random: sort === "RANDOM" ? true : undefined,
    },
  );

export const useImages = (
  tags: Ref<readonly string[]>,
  sort: Ref<ImageSort>,
) => {
  const clientHandle = useClientHandle();

  const fetching = ref(false);
  const stale = ref(false);
  const error = ref<CombinedError>();

  const edges = ref<ImagesResult["images"]["edges"]>([]);
  const hasNextPage = ref(true);

  const handleChange = (res: OperationResult<ImagesResult, ImagesArgs>): void => {
    if (res.data) {
      const usedCursor = res.operation.variables.last
        ? res.operation.variables.before
        : res.operation.variables.after;

      const { edges: newEdges, pageInfo } = res.data.images;

      edges.value = ((prevEdges) => {
        if (newEdges.length > 0) {
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
      .catch((error_: CombinedError) => {
        error.value = error_;
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

  const timeoutId = ref<ReturnType<typeof globalThis.setTimeout>>();

  const cancelTimeout = () => {
    globalThis.clearTimeout(timeoutId.value);
    timeoutId.value = undefined;
  };

  const resetTimeout = () => {
    globalThis.clearTimeout(timeoutId.value);

    if (!fetching.value && !stale.value && sort.value === "NEWEST") {
      timeoutId.value = globalThis.setTimeout(refresh, 20_000);
    }
  };

  onMounted(() => newQuery());

  onBeforeUnmount(() => clearTimeout(timeoutId.value));

  watch(fetching, resetTimeout);
  watch(stale, resetTimeout);

  watch(tags, () => newQuery());
  watch(sort, () => newQuery());

  return {
    images: computed(() => edges.value.map(edge => edge.node)),
    fetching,
    error,
    stale,
    fetchMore,
  };
};
