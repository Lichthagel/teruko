import type { Client, CombinedError } from "@urql/svelte";

import type { TagExt } from "models";
import { gql } from "@urql/svelte";
import { readable, writable } from "svelte/store";

type SuggestionsResult = {
  fetching: boolean;
  error: CombinedError | undefined;
  suggestions: TagExt[];
};

// TODO make reactive to query including debounce
const suggestionsStore = (client: Client, query: string) => {
  if (query.length < 3) {
    return readable<SuggestionsResult>({
      fetching: false,
      error: undefined,
      suggestions: [],
    });
  }

  const result = writable<SuggestionsResult>(
    {
      fetching: true,
      error: undefined,
      suggestions: [],
    },
    () => {
      const querySubscription = client
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
        .subscribe(({ data, error }) => {
          result.set({
            fetching: false,
            error,
            suggestions: data?.tagSuggestions ?? [],
          });
        });

      return () => {
        querySubscription.unsubscribe();
      };
    },
  );

  return result;
};

export default suggestionsStore;
