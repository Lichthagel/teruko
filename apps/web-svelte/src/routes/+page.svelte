<script lang="ts">
  import Gallery from "$lib/components/Gallery.svelte";
  import ScrollButtons from "$lib/components/ScrollButtons.svelte";
  import Filters from "$lib/components/filters/Filters.svelte";
  import { tags, sort } from "server-common/stores";
</script>

<svelte:head>
  <title>てる子</title>
</svelte:head>

<div class="container mx-auto">
  <Filters />

  {#key $tags}
    {#key $sort || "NEWEST"}
      <Gallery tags={$tags} sort={$sort || "NEWEST"} />
    {/key}
  {/key}
</div>

<ScrollButtons />
