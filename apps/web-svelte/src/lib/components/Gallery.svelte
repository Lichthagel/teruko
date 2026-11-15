<script lang="ts">
  import type { ImageSort } from "models";
  import type { Action } from "svelte/action";
  import { createWindowVirtualizer } from "@tanstack/svelte-virtual";
  import styles from "client-css/m/gallery.module.scss";
  import { galleryState, initialGalleryLayout, virtualCardStyle, virtualGalleryOptions, watchGallery } from "client-graphql/gallery";
  import { onMount, untrack } from "svelte";
  import { get } from "svelte/store";
  import StatusBar from "#lib/components/status/StatusBar.svelte";
  import { useImages } from "#lib/images.svelte.js";
  import ImageCard from "./ImageCard.svelte";
  import ErrorMessage from "./status/ErrorMessage.svelte";

  type Props = {
    tags?: readonly string[];
    sort?: ImageSort;
  };

  const { tags = [], sort = "NEWEST" }: Props = $props();

  const result = useImages(() => tags, () => sort);

  const savedState = untrack(() => galleryState(tags, sort));
  let gallery = $state<HTMLDivElement>();
  let layout = $state(initialGalleryLayout(savedState));
  const virtualizer = createWindowVirtualizer<HTMLDivElement>(untrack(() => virtualGalleryOptions([], savedState, layout)));
  $effect(() => {
    const options = virtualGalleryOptions(result.images, savedState, layout);
    untrack(() => get(virtualizer).setOptions(options));
  });
  onMount(() => watchGallery(gallery!, savedState, (value) => {
    layout = value;
  }, () => $virtualizer.takeSnapshot(), (index) => {
    $virtualizer.scrollToIndex(index, { align: "start" });
    $virtualizer.cancelScroll();
  }));
  const measure: Action<HTMLDivElement> = (node) => {
    $virtualizer.measureElement(node);
    return {
      destroy: () => $virtualizer.measureElement(null),
    };
  };

  $effect(() => {
    const last = $virtualizer.getVirtualItems().at(-1);
    if (last && last.index >= result.images.length - layout.columns * 3 && !result.fetching) {
      untrack(() => result.fetchMore());
    }
  });
</script>

{#if result.images}
  <div bind:this={gallery} class={styles.gallery} style:height={`${$virtualizer.getTotalSize()}px`} data-gallery data-gallery-count={result.images.length}>
    {#each $virtualizer.getVirtualItems() as item (item.key)}
      <div data-index={item.index} use:measure class={styles["virtual-card"]} style:width={virtualCardStyle(item, layout).width} style:transform={virtualCardStyle(item, layout).transform}>
        <ImageCard image={result.images[item.index]!} />
      </div>
    {/each}
  </div>
  <div class={styles.sentinel}></div>
{/if}

{#if result.error}
  <ErrorMessage error={result.error} title={result.error.name}></ErrorMessage>
{/if}

<StatusBar error={!!result.error} fetching={result.fetching}></StatusBar>
