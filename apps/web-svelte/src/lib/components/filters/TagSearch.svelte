<script lang="ts">
  /** eslint-disable promise/prefer-await-to-then */
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import suggestionsStore from "$lib/suggestionsStore";
  import { getContextClient } from "@urql/svelte";
  import { Loader2 } from "lucide-svelte";

  const client = getContextClient();

  let tagInput = "";
  let activeSuggestion = 0;

  $: suggestionsResult = suggestionsStore(client, tagInput);

  $: fetching = $suggestionsResult.fetching;
  $: error = $suggestionsResult.error; // TODO: Handle error
  $: suggestions = $suggestionsResult.suggestions;

  const handleSubmit = () => {
    if (suggestions.length === 0) return;

    tagInput = "";
    activeSuggestion = 0;

    const searchParams = new URLSearchParams($page.url.searchParams);

    searchParams.append("tag", suggestions[activeSuggestion].slug);

    void goto(`${$page.url.pathname}?${searchParams.toString()}`, {
      keepFocus: true,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter": {
        e.preventDefault();

        handleSubmit();

        break;
      }
      case "ArrowUp": {
        e.preventDefault();

        if (activeSuggestion > 0) {
          activeSuggestion--;
        }

        break;
      }
      case "ArrowDown": {
        e.preventDefault();

        if (activeSuggestion < suggestions.length - 1) {
          activeSuggestion++;
        }

        break;
      }
      case "Escape": {
        e.preventDefault();

        tagInput = "";
        activeSuggestion = 0;

        const searchParams = new URLSearchParams($page.url.searchParams);

        searchParams.delete("tag");

        void goto(`${$page.url.pathname}?${searchParams.toString()}`, {
          keepFocus: true,
        });

        break;
      }
      // No default
    }
  };
</script>

<div class="relative inline-block">
  <input
    type="text"
    class="h-10 rounded bg-base-100 px-2 focus:outline-none"
    placeholder="Search..."
    bind:value={tagInput}
    on:keydown={handleKeyDown}
  />

  {#if fetching}
    <div
      class="absolute left-0 right-0 z-20 flex h-20 items-center justify-center bg-base-100 p-1"
    >
      <Loader2 class="h-14 w-14 animate-spin" />
    </div>
  {/if}

  {#if suggestions.length > 0}
    <ul class="absolute left-0 right-0 z-20 block bg-base-100 p-1">
      {#each suggestions as suggestion, index (suggestion.slug)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          class="my-1 h-10 cursor-pointer rounded p-2"
          class:bg-primary={index === activeSuggestion}
          class:text-primary-content={index === activeSuggestion}
          class:bg-neutral={index !== activeSuggestion}
          class:text-neutral-content={index !== activeSuggestion}
          on:click={() => handleSubmit()}
          on:mouseenter={() => (activeSuggestion = index)}
          style:background-color={(index === activeSuggestion &&
            suggestion.category &&
            suggestion.category.color) ||
            undefined}
          style:color={(index !== activeSuggestion &&
            suggestion.category &&
            suggestion.category.color) ||
            undefined}
        >
          {suggestion.slug}
        </li>
      {/each}
    </ul>
  {/if}
</div>
