<script lang="ts">
  import { useSuggestions } from "$lib/suggestions.svelte.js";
  import { Icon as IconType, LoaderCircle } from "@lucide/svelte";
  import styles from "client-css/m/taginput.module.scss";

  let {
    icon,
    tagInput = $bindable(""),
    clearOnSubmit = true,
    onSubmit,
    onEscape,
  }: {
    icon?: typeof IconType;
    tagInput?: string;
    clearOnSubmit?: boolean;
    onSubmit: (value: string) => void;
    onEscape?: () => void;
  } = $props();

  let activeSuggestion = $state(0);

  const suggestionsResult = useSuggestions(() => tagInput);

  const fetching = $derived(suggestionsResult.fetching);
  // $: error = $suggestionsResult.error; // TODO: Handle error
  const suggestions = $derived(suggestionsResult.suggestions);

  const handleSubmit = () => {
    const suggestion = suggestions[activeSuggestion];

    if (!suggestion) {
      return;
    }

    onSubmit(suggestion.slug);
    if (clearOnSubmit) {
      tagInput = "";
    }
    activeSuggestion = 0;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();

        if (activeSuggestion < suggestions.length - 1) {
          activeSuggestion++;
        }

        break;
      }
      case "ArrowUp": {
        e.preventDefault();

        if (activeSuggestion > 0) {
          activeSuggestion--;
        }

        break;
      }
      case "Enter": {
        e.preventDefault();

        handleSubmit();

        break;
      }
      case "Escape": {
        e.preventDefault();

        tagInput = "";
        activeSuggestion = 0;

        onEscape?.();

        break;
      }
    // No default
    }
  };
</script>

<div class={styles["search-container"]}>
  {#if icon}
    {@const Icon = icon}
    <Icon />
  {/if}

  <input
    bind:value={tagInput}
    onkeydown={handleKeyDown}
    placeholder="Search..."
    type="text"
  />

  {#if fetching}
    <div class={styles["suggestions-loading"]}>
      <LoaderCircle class={styles.icon} />
    </div>
  {/if}

  {#if suggestions.length > 0}
    <ul class={styles["suggestions-container"]}>
      {#each suggestions as suggestion, index (suggestion.slug)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          class={index === activeSuggestion ? styles.active : undefined}
          onclick={() => handleSubmit()}
          onmouseenter={() => (activeSuggestion = index)}
          style:background-color={(index === activeSuggestion && suggestion.category && suggestion.category.color) || undefined}
          style:color={(index !== activeSuggestion && suggestion.category && suggestion.category.color) || undefined}
        >
          {suggestion.slug}
        </li>
      {/each}
    </ul>
  {/if}
</div>
