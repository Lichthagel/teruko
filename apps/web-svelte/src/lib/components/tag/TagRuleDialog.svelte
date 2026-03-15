<script lang="ts">
  import Dialog from "../Dialog.svelte";

  let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<Dialog bind:open={open}>
  Tag Rule Dialog
</Dialog>
