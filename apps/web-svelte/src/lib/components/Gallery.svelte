<script lang="ts">
  import ImageCard from "./ImageCard.svelte";
  import imagesStore from "$lib/imagesStore";
  import { getContextClient } from "@urql/svelte";
  import type { ImageSort } from "models";
  import type { Action } from "svelte/action";
  import ErrorMessage from "./status/ErrorMessage.svelte";
  import StatusBar from "$lib/components/status/StatusBar.svelte";

  export let tags: readonly string[] = [];
  export let sort: ImageSort = "NEWEST";

  const client = getContextClient();

  const result = imagesStore(client, tags, sort);

  const endAction: Action = (node) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        $result.fetchMore();
      }
    });

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      },
    };
  };
</script>

{#if $result.images}
  <div
    class="grid grid-cols-1 grid-rows-masonry gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5"
  >
    {#each $result.images as image}
      <ImageCard {image} />
    {/each}
    <div use:endAction />
  </div>
{/if}

{#if $result.error}
  <ErrorMessage title={$result.error.name} error={$result.error} />
{/if}

<StatusBar fetching={$result.fetching} error={!!$result.error} />
