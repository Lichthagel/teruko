<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import styles from "client-css/m/form.module.scss";

  const {
    loading = false,
    loadingLabel = "Loading",
    type = "button",
    children,
    ...restProps
  }: { loading?: boolean; loadingLabel?: string; type?: "button" | "submit" | "reset"; children: Snippet } & HTMLButtonAttributes = $props();
</script>

<button
  class={styles.buttonPrimary}
  {type}
  {...restProps}
  disabled={loading || restProps.disabled}
  aria-busy={loading}
  aria-label={loading ? loadingLabel : restProps["aria-label"]}
>
  {@render children()}
</button>
