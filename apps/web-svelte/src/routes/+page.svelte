<script lang="ts">
  import Gallery from "$lib/components/Gallery.svelte";
  import ScrollButtons from "$lib/components/ScrollButtons.svelte";
  import Filters from "$lib/components/filters/Filters.svelte";
  import { sortStore, tagsStore } from "client-common/stores";
</script>

<svelte:head>
  <title>てる子</title>
</svelte:head>

<div class="container mx-auto">
  <Filters />

  {#key $tagsStore}
    {#key $sortStore || "NEWEST"}
      <Gallery sort={$sortStore || "NEWEST"} tags={$tagsStore} />
    {/key}
  {/key}
</div>

<ScrollButtons />
