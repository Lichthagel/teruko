<script lang="ts">
  import type { ImageSort } from "models";
  import type { Action } from "svelte/action";

  import StatusBar from "$lib/components/status/StatusBar.svelte";
  import imagesStore from "$lib/imagesStore";
  import { getContextClient } from "@urql/svelte";
  import styles from "client-css/m/gallery.module.scss";

  import ImageCard from "./ImageCard.svelte";
  import ErrorMessage from "./status/ErrorMessage.svelte";

  export let tags: readonly string[] = [];
  export let sort: ImageSort = "NEWEST";

  const client = getContextClient();

  const result = imagesStore(client, tags, sort);

  const endAction: Action = (node) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
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
  <div class={styles.gallery}>
    {#each $result.images as image}
      <ImageCard {image} />
    {/each}
    <div use:endAction />
  </div>
{/if}

{#if $result.error}
  <ErrorMessage error={$result.error} title={$result.error.name} />
{/if}

<StatusBar error={!!$result.error} fetching={$result.fetching} />
