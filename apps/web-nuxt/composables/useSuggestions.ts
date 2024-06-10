/* eslint-disable promise/always-return */
/* eslint-disable promise/prefer-await-to-then */
import { CombinedError, gql, useClientHandle } from "@urql/vue";
import type { TagExt } from "models";

const useSuggestions = (
  query: Ref<string>,
): {
  fetching: Ref<boolean>;
  error: Ref<CombinedError | null>;
  suggestions: Ref<TagExt[]>;
} => {
  const clientHandle = useClientHandle();

  const fetching = ref(false);
  const combinedError = ref<CombinedError | null>(null);
  const suggestions = ref<TagExt[]>([]);

  watch(query, (query) => {
    if (query.length < 3) {
      suggestions.value = [];
      fetching.value = false;
      return;
    }

    fetching.value = true;
    const timeout = setTimeout(() => {
      clientHandle.client
        .query<{ tagSuggestions: TagExt[] }>(
          gql`
            query TagSuggestions($query: String!) {
              tagSuggestions(query: $query) {
                slug
                category {
                  color
                }
              }
            }
          `,
          { query },
        )
        .toPromise()
        .then(({ data }) => {
          if (data?.tagSuggestions) {
            suggestions.value = data.tagSuggestions;
            fetching.value = false;
            return;
          }

          suggestions.value = [];
          fetching.value = false;
        })
        .catch((error: CombinedError) => {
          fetching.value = false;
          combinedError.value = error;
        });
    }, 250);

    return () => clearTimeout(timeout);
  });

  return {
    fetching,
    error: combinedError,
    suggestions,
  };
};

export default useSuggestions;
