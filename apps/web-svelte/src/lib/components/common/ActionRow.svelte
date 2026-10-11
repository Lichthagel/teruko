<script lang="ts">
  import type { Snippet } from "svelte";
  import styles from "client-css/m/form.module.scss";

  const { children }: { children: Snippet } = $props();
</script>

<div class={styles.actionRow}>
  {@render children()}
</div>
