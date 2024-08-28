<script lang="ts">
  import { tagsStore } from "client-common/stores";
  import { ListX } from "lucide-svelte";

  import SortSelect from "./SortSelect.svelte";
  import TagQuery from "./TagQuery.svelte";
  import TagSearch from "./TagSearch.svelte";

  const resetTags = () => {
    tagsStore.set([]);
  };
</script>

<div class="mb-2 flex w-full flex-wrap gap-1">
  <!-- TAG CHIPS -->

  {#if $tagsStore.length > 0}
    <div class="inline-flex">
      {#each $tagsStore as tag}
        {#key tag}
          <TagQuery {tag} />
        {/key}
      {/each}
      <button
        class="m-0.5 box-border inline-block h-10 w-10 rounded bg-neutral px-2 text-neutral-content transition hover:brightness-75"
        on:click|preventDefault={resetTags}
      >
        <ListX class="h-6 w-6" />
      </button>
    </div>
  {/if}

  <!-- TAG INPUT -->
  <TagSearch />

  <!-- SORT SELECT -->
  <SortSelect />
</div>
