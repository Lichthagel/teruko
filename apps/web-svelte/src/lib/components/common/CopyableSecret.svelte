<script lang="ts">
  import { Check, Copy } from "@lucide/svelte";
  import styles from "client-css/m/form.module.scss";

  const { value, label = "Secret" }: { value: string; label?: string } = $props();
  let copied = $state(false);
  let error = $state("");

  const copy = async () => {
    copied = false;
    error = "";
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
      error = "";
    } catch (cause) {
      error = cause instanceof Error ? cause.message : String(cause);
    }
  };
</script>

<div class={styles.secretField}>
  <input class={styles.maskedInput} type="text" aria-label={label} value={value} readonly />
  <button class={`${styles.buttonSecondary} ${styles.copyButton}`} type="button" aria-label={copied ? "Copied" : "Copy token"} onclick={() => void copy()}>
    {#if copied}
      <Check class={styles.copyIcon} aria-hidden="true" />
    {:else}
      <Copy class={styles.copyIcon} aria-hidden="true" />
    {/if}
  </button>
</div>
{#if error}<p class={styles.formError} role="alert">{error}</p>{/if}
