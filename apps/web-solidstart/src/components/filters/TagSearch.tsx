import { createQuery } from "@urql/solid";
import styles from "client-css/m/filters.module.scss";
import { TagSuggestions } from "client-graphql/snippets";
import { LoaderCircle, Search } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import { setTags } from "~/utils/filters";

export const TagSearch = () => {
  const [tagInput, setTagInput] = createSignal("");
  const [activeSuggestion, setActiveSuggestion] = createSignal(0);

  const [result] = createQuery(({
    query: TagSuggestions,
    variables: () => ({ query: tagInput() }),
    pause: () => tagInput().length < 3,
  }));

  const fetching = createMemo(() => result.fetching);
  const suggestions = createMemo(() => (tagInput().length >= 3 && result.data?.tagSuggestions) || []);

  const handleSubmit = () => {
    const suggestion = suggestions()[activeSuggestion()];

    if (!suggestion) {
      return;
    }

    setTags(prev => [...prev, suggestion.slug]);
    setTagInput("");
    setActiveSuggestion(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();

        setActiveSuggestion((prev) => {
          if (prev < suggestions().length - 1) {
            return prev + 1;
          } else {
            return prev;
          }
        });

        break;
      }
      case "ArrowUp": {
        e.preventDefault();

        setActiveSuggestion((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            return 0;
          }
        });

        break;
      }
      case "Enter": {
        e.preventDefault();

        handleSubmit();

        break;
      }
      case "Escape": {
        e.preventDefault();

        setTagInput("");
        setActiveSuggestion(0);

        setTags([]);

        break;
      }
    // No default
    }
  };

  return (
    <div class={styles["search-container"]}>
      <Search />

      <input
        value={tagInput()}
        onInput={e => setTagInput(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        type="text"
      />

      <Show when={fetching()}>

        <div class={styles["suggestions-loading"]}>
          <LoaderCircle class={styles.icon} />
        </div>
      </Show>

      <Show when={suggestions().length > 0}>

        <ul class={styles["suggestions-container"]}>
          <For each={suggestions()}>
            {(suggestion, index) => (
              <li
                class={index() === activeSuggestion() ? styles.active : undefined}
                onClick={() => handleSubmit()}
                onMouseEnter={() => setActiveSuggestion(index())}
                style={{
                  "background-color": (index() === activeSuggestion() && suggestion.category && suggestion.category.color) || undefined,
                  "color": (index() !== activeSuggestion() && suggestion.category && suggestion.category.color) || undefined,
                }}
              >
                {suggestion.slug}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>

  );
};
