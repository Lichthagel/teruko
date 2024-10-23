<script lang="ts">
  import suggestionsStore from "$lib/suggestionsStore.js";
  import { getContextClient } from "@urql/svelte";
  import styles from "client-css/m/filters.module.scss";
  import { tagsStore } from "client-stores";
  import { Loader2, Search } from "lucide-svelte";

  const client = getContextClient();

  let tagInput = "";
  let activeSuggestion = 0;

  $: suggestionsResult = suggestionsStore(client, tagInput);

  $: fetching = $suggestionsResult.fetching;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $: error = $suggestionsResult.error; // TODO: Handle error
  $: suggestions = $suggestionsResult.suggestions;

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
    on:keydown={handleKeyDown}
    placeholder="Search..."
    type="text"
  />

  {#if fetching}
    <div class={styles["suggestions-loading"]}>
      <Loader2 class={styles.icon} />
    </div>
  {/if}

  {#if suggestions.length > 0}
    <ul class={styles["suggestions-container"]}>
      {#each suggestions as suggestion, index (suggestion.slug)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          class={index === activeSuggestion ? styles.active : undefined}
          on:click={() => handleSubmit()}
          on:mouseenter={() => (activeSuggestion = index)}
          style:background-color={(index === activeSuggestion
            && suggestion.category
            && suggestion.category.color)
            || undefined}
          style:color={(index !== activeSuggestion
            && suggestion.category
            && suggestion.category.color)
            || undefined}
        >
          {suggestion.slug}
        </li>
      {/each}
    </ul>
  {/if}
</div>
