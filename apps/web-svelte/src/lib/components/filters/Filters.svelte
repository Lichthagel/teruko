<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { ListX } from "lucide-svelte";
  import TagQuery from "./TagQuery.svelte";

  $: tags = $page.url.searchParams.getAll("tag");

  const resetTags = () => {
    const url = new URL($page.url);

    url.searchParams.delete("tag");

    void goto(url);
  };
</script>

<div class="mb-2">
  <!-- TAG CHIPS -->

  {#if tags.length > 0}
    <div class="flex">
      {#each tags as tag}
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

  <!-- SORT SELECT -->
</div>
