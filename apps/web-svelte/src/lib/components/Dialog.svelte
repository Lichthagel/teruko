<script lang="ts">
  import type { Snippet } from "svelte";
  import styles from "client-css/m/dialog.module.scss";

  let { children, open = $bindable(false) }: { children: Snippet; open?: boolean } = $props();

  let dialogRef = $state<HTMLDialogElement>();

  $effect(() => {
    if (dialogRef) {
      if (open) {
        dialogRef.showModal();
      } else {
        dialogRef.close();
      }
    }
  });
</script>

{#if open}
  <dialog class={styles.dialog} bind:this={dialogRef} closedby="any" onclose={() => open = false}>
    {@render children?.()}
  </dialog>
{/if}
