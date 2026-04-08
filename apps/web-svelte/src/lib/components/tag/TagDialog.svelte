<script lang="ts">
  import { filters } from "$lib/filters.svelte";
  import styles from "client-css/m/tag.module.scss";
  import Dialog from "../common/Dialog.svelte";
  import TagEditSection from "./TagEditSection.svelte";

  let { open = $bindable(false), slug }: { open?: boolean; slug: string } = $props();

  const afterUpdate = (newSlug?: string) => {
    open = false;
    if (newSlug) {
      const idx = filters.tags.findIndex(el => el === slug);
      if (idx >= 0) {
        filters.tags = filters.tags.toSpliced(idx, 1, newSlug);
      }
    }
  };
</script>

<Dialog bind:open={open} class={styles["tag-dialog"]}>
  <TagEditSection {slug} afterUpdate={afterUpdate} />
</Dialog>
