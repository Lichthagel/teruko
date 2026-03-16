<script lang="ts">
  import Dialog from "../Dialog.svelte";
  import TagEditSection from "./TagEditSection.svelte";
  import TagRuleSection from "./TagRuleSection.svelte";

  let { open = $bindable(false), slug }: { open?: boolean; slug: string } = $props();
</script>

<Dialog bind:open={open} class="tag-dialog">
  <TagEditSection {slug} />

  <TagRuleSection {slug} />
</Dialog>

<style>
:global .tag-dialog {
  width: 50rem;
  padding-bottom: 5rem;
}
</style>
