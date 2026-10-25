<script lang="ts">
  import type { Snippet } from "svelte";
  import styles from "client-css/m/form.module.scss";

  const { id, title, children }: { id: string; title: string; children: Snippet } = $props();
</script>

<section class={styles.panel} aria-labelledby={id}>
  <h2 {id} class={styles.panelTitle}>{title}</h2>
  {@render children()}
</section>
