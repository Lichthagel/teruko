<script lang="ts">
  import styles from "client-css/m/tag.module.scss";
  import Dialog from "../common/Dialog.svelte";

  let { open = $bindable(false), slug }: { open?: boolean; slug: string } = $props();

// const onSubmit = (newSlug?: string) => {
  //   open = false;
  //   if (newSlug) {
  //     const idx = filters.tags.findIndex(el => el === slug);
  //     if (idx >= 0) {
  //       filters.tags = filters.tags.toSpliced(idx, 1, newSlug);
  //     }
  //   }
  // };
</script>

<Dialog bind:open={open} class={styles["tag-dialog"]}>
  <!-- <TagEditSection {slug} onSubmit={onSubmit} /> -->
  hello {slug}
</Dialog>
