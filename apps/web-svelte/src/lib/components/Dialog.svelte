<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLDialogAttributes } from "svelte/elements";
  import styles from "client-css/m/dialog.module.scss";

  let { children, open = $bindable(false), class: className, ...restProps }: { children: Snippet; open?: boolean } & HTMLDialogAttributes = $props();

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
  <dialog class={[className, styles.dialog]} bind:this={dialogRef} closedby="any" onclose={() => open = false} {...restProps}>
    {@render children?.()}
  </dialog>
{/if}
