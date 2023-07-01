<script lang="ts">
  import Gallery from "$lib/components/Gallery.svelte";
  import ScrollButtons from "$lib/components/ScrollButtons.svelte";

  import { page } from "$app/stores";
  import { zImageSort } from "models";

  $: tags = $page.url.searchParams.getAll("tag");
  $: sort =
    zImageSort.nullish().parse($page.url.searchParams.get("sort")) ?? "NEWEST";
</script>

<svelte:head>
  <title>てる子</title>
</svelte:head>

<div class="container mx-auto">
  {#key tags}
    {#key sort}
      <Gallery {tags} {sort} />
    {/key}
  {/key}
</div>

<ScrollButtons />
