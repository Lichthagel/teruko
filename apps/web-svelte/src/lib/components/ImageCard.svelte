<script lang="ts">
  import type { ImageExt } from "models";

  import styles from "client-css/m/gallery.module.scss";
  import { tagsStore } from "client-stores";
  import { fly } from "svelte/transition";

  export let image: ImageExt;

  const onTagClick = (slug: string) => {
    tagsStore.set([slug]);
  };
</script>

<div class={styles.card} in:fly={{ y: 200 }}>
  <a href={`/${image.id}`}>
    <div class={styles["image-container"]}>
      <img
        alt={image.title ?? image.filename}
        height={image.height}
        src={`/img/${image.filename}`}
        width={image.width}
      />

      {#if !!image.title}
        <div>
          {image.title}
        </div>
      {/if}
    </div>
  </a>
  <div class={styles["tag-list"]}
  >
    {#each (image.tags ?? []).filter((tag) => !tag.slug.startsWith("artist_")) as tag}
      <button
        on:click={() => onTagClick(tag.slug)}
        style:background-color={tag.category?.color ?? "gray"}
        type="button"
      >
        {tag.slug}
      </button>
    {/each}
  </div>
</div>
