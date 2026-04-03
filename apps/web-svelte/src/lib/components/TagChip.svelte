<script lang="ts">
  import type { TagExt } from "models";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { filters } from "$lib/filters.svelte.js";
  import styles from "client-css/m/imagepage.module.scss";

  type Props = {
    tag: TagExt;
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
  {tag.slug}
</button>
