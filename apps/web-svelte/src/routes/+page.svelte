<script lang="ts">
  import Filters from "$lib/components/filters/Filters.svelte";
  import Gallery from "$lib/components/Gallery.svelte";
  import ScrollButtons from "$lib/components/ScrollButtons.svelte";
  import { sortStore, tagsStore } from "client-stores";
</script>

<svelte:head>
  <title>てる子</title>
</svelte:head>

<div class="container">
  <Filters />

  {#key $tagsStore}
    {#key $sortStore || "NEWEST"}
      <Gallery sort={$sortStore || "NEWEST"} tags={$tagsStore} />
    {/key}
  {/key}
</div>

<ScrollButtons />
