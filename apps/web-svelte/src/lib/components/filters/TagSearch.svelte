<script lang="ts">
  import suggestionsStore from "$lib/suggestionsStore.js";
  import { LoaderCircle, Search } from "@lucide/svelte";
  import { getContextClient } from "@urql/svelte";
  import styles from "client-css/m/filters.module.scss";
  import { tagsStore } from "client-stores";

  const client = getContextClient();

  let tagInput = $state("");
  let activeSuggestion = $state(0);

  const suggestionsResult = $derived(suggestionsStore(client, tagInput));

  const fetching = $derived($suggestionsResult.fetching);
  // $: error = $suggestionsResult.error; // TODO: Handle error
  const suggestions = $derived($suggestionsResult.suggestions);

  const handleSubmit = () => {
    const suggestion = suggestions[activeSuggestion];

    if (!suggestion) {
      return;
    }

    tagsStore.set([...$tagsStore, suggestion.slug]);
    tagInput = "";
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

        tagsStore.set([]);

        break;
      }
    // No default
    }
  };
</script>

<div class={styles["search-container"]}>
  <Search />

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
