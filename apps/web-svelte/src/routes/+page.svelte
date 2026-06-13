<script lang="ts">
  import Filters from "$lib/components/filters/Filters.svelte";
  import Gallery from "$lib/components/Gallery.svelte";
  import ScrollButtons from "$lib/components/ScrollButtons.svelte";
  import { filters } from "$lib/filters.svelte.js";
</script>

<svelte:head>
  <title>てる子</title>
</svelte:head>

<div class="container">
  <Filters />

  <Gallery sort={filters.sort} tags={filters.tags} />
</div>

<ScrollButtons />
