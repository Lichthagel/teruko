<script lang="ts">
  import type { Snippet } from "svelte";
  import styles from "client-css/m/form.module.scss";

  const { children }: { children: Snippet } = $props();
</script>

<p class={styles.formError} role="alert">
  {@render children()}
</p>
