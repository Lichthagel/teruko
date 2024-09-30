<script lang="ts">
  import type { TagExt } from "models";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import styles from "client-css/m/imagepage.module.scss";
  import { tagsStore } from "client-stores";

  export let tag: TagExt;

  const onClick = () => {
    tagsStore.set([tag.slug]);
    void goto(`${base}/`);
  };
</script>

<button
  class={styles["tag-chip"]}
  on:click={onClick}
  style={tag.category?.color && `background-color: ${tag.category?.color}`}
  type="button"
>
  {tag.slug}
</button>
