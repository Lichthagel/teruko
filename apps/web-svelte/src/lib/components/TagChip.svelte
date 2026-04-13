<script lang="ts">
  import type { Tag, TagCategory } from "models";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { filters } from "$lib/filters.svelte.js";
  import { BadgeCheck } from "@lucide/svelte";
  import styles from "client-css/m/imagepage.module.scss";

  type Props = {
    tag: Pick<Tag, "slug" | "approved"> & { category?: Pick<TagCategory, "color"> | null };
  };

  const { tag }: Props = $props();

  const onClick = () => {
    filters.tags = [tag.slug];
    void goto(resolve("/", {}));
  };
</script>

<button
  class={styles["tag-chip"]}
  onclick={onClick}
  style={tag.category?.color && `background-color: ${tag.category?.color}`}
  type="button"
>
  <span>{tag.slug}</span>
  {#if tag.approved}
    <BadgeCheck size={16} />
  {/if}
</button>
