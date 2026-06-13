import type { CombinedError } from "@urql/svelte";
import type { TagExt } from "models";
import { getContextClient } from "@urql/svelte";
import { TagSuggestions } from "client-graphql/snippets";

export const useSuggestions = (query: () => string) => {
  const client = getContextClient();

  let fetching = $state(false);
  let error = $state<CombinedError>();
  let suggestions = $state<TagExt[]>([]);

  $effect(() => {
    if (query().length < 3) {
      fetching = false;
      error = undefined;
      suggestions = [];
      return () => {};
    }

    fetching = true;

    const querySubscription = client
    .query(
      TagSuggestions,
    { query: query() },
    )
    .subscribe(({ data, error: error_ }) => {
      error = error_;
      suggestions = data?.tagSuggestions ?? [];
      fetching = false;
    });

    return () => {
      querySubscription.unsubscribe();
    };
  });

  return {
    get fetching() {
      return fetching;
    },
    get error() {
      return error;
    },
    get suggestions() {
      return suggestions;
    },
  };
};
