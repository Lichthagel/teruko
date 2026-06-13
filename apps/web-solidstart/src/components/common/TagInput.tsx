import type { LucideIcon } from "lucide-solid";
import type { Component, JSX } from "solid-js";
import { createQuery } from "@urql/solid";
import styles from "client-css/m/taginput.module.scss";
import { TagSuggestions } from "client-graphql/snippets";
import { LoaderCircle } from "lucide-solid";
import { createEffect, createMemo, createSignal, For, mergeProps, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

const TagInput: Component<{
  icon?: LucideIcon;
  tagInput?: string;
  setTagInput?: (value: string) => void;
  clearOnSubmit?: boolean;
  onSubmit?: (value: string) => void;
  onEscape?: () => void;
}> = (props_) => {
  const props = mergeProps({ clearOnSubmit: true }, props_);

  const [tagInput, setTagInput] = createSignal("");
  const [activeSuggestion, setActiveSuggestion] = createSignal(0);

  createEffect(() => {
    setTagInput(props.tagInput ?? "");
  });

  createEffect(() => {
    props.setTagInput?.(tagInput());
  });

  const [result] = createQuery(({
    query: TagSuggestions,
    variables: () => ({ query: tagInput() ?? "" }),
    pause: () => tagInput().length < 3,
  }));

  const fetching = createMemo(() => result.fetching);
  const suggestions = createMemo(() => (tagInput().length >= 3 && result.data?.tagSuggestions) || []);

  const handleSubmit = () => {
    const suggestion = suggestions()[activeSuggestion()];

    if (!suggestion) {
      return;
    }

    props.onSubmit?.(suggestion.slug);
    if (props.clearOnSubmit) {
      setTagInput("");
    }
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

        props.onEscape?.();

        break;
      }
    // No default
    }
  };

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
    e.preventDefault();

    setTagInput(e.currentTarget.value);
  };

  return (
    <div class={styles["search-container"]}>
      <Show when={props.icon}>
        <Dynamic component={props.icon} class={styles.icon} />
      </Show>

      <input
        value={tagInput()}
        onInput={handleInput}
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

export default TagInput;
