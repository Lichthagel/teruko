<script lang="ts">
  import { filters } from "$lib/filters.svelte.js";
  import Dialog from "../Dialog.svelte";
  import TagEditSection from "./TagEditSection.svelte";
  import TagRuleSection from "./TagRuleSection.svelte";

  let { open = $bindable(false), slug }: { open?: boolean; slug: string } = $props();

  const onSubmit = (newSlug?: string) => {
    open = false;
    if (newSlug) {
      const idx = filters.tags.findIndex(el => el === slug);
      if (idx >= 0) {
        filters.tags = filters.tags.toSpliced(idx, 1, newSlug);
      }
    }
  };
</script>

<Dialog bind:open={open} class="tag-dialog">
  <TagEditSection {slug} onSubmit={onSubmit} />

  <TagRuleSection {slug} />
</Dialog>

<style>
:global .tag-dialog {
  width: 50rem;
  padding-bottom: 5rem;
}
</style>
