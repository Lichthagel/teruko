<script lang="ts">
  import type { Snippet } from "svelte";
  import styles from "client-css/m/form.module.scss";

  const { title, children }: { title: string; children: Snippet } = $props();
</script>

<main class={styles.page}>
  <h1 class={styles.pageTitle}>{title}</h1>
  {@render children()}
</main>
