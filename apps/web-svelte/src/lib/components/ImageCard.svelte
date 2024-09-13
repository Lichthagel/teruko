<script lang="ts">
  import type { ImageExt } from "models";

  import { tagsStore } from "client-stores";
  import { fly } from "svelte/transition";

  export let image: ImageExt;

  const onTagClick = (slug: string) => {
    tagsStore.set([slug]);
  };
</script>

<div class="mb-1 bg-zinc-300 shadow-xl dark:bg-gray-700" in:fly={{ y: 200 }}>
  <a href={`/${image.id}`}>
    <div class="relative">
      <img
        alt={image.title ?? image.filename}
        height={image.height}
        src={`/img/${image.filename}`}
        width={image.width}
      />

      {#if !!image.title}
        <div class="text-shadow-xl absolute bottom-0 left-0 right-0 z-10 overflow-hidden whitespace-nowrap bg-gradient-to-b from-transparent to-black/80 px-1 text-sm text-white">
          {image.title}
        </div>
      {/if}
    </div>
  </a>
  <div class="snap flex snap-x flex-row flex-nowrap overflow-x-scroll scrollbar-none"
  >
    {#each (image.tags ?? []).filter((tag) => !tag.slug.startsWith("artist_")) as tag}
      <button
        class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-1 text-sm text-white transition hover:brightness-75"
        on:click={() => onTagClick(tag.slug)}
        style:background-color={tag.category?.color ?? "gray"}
      >
        {tag.slug}
      </button>
    {/each}
  </div>
</div>
