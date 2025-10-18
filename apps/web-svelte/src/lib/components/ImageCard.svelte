<script lang="ts">
  import type { ImageExt } from "models";

  import { resolve } from "$app/paths";
  import styles from "client-css/m/gallery.module.scss";
  import { tagsStore } from "client-stores";
  import { fly } from "svelte/transition";

  type Props = {
    image: ImageExt;
  };

  const { image }: Props = $props();

  const onTagClick = (slug: string) => {
    tagsStore.set([slug]);
  };
</script>

<div class={styles.card} in:fly={{ y: 200 }}>
  <a href={resolve(`/[id]`, { id: `${image.id}` })}>
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
  <div class={styles["tag-list"]}>
    {#each (image.tags ?? []).filter(tag => !tag.slug.startsWith("artist_")) as tag (tag.slug)}
      <button
        onclick={() => onTagClick(tag.slug)}
        style:background-color={tag.category?.color ?? "gray"}
        type="button"
      >
        {tag.slug}
      </button>
    {/each}
  </div>
</div>
