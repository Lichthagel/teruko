<script lang="ts">
  import styles from "client-css/m/error.module.scss";
  import { Home } from "lucide-svelte";

  export let title: string | undefined = "An error occurred";
  export let subtitle: string | undefined;
  export let message: string | undefined;
  export let error: Error | undefined;
</script>

<div class={styles.backdrop}>
  <div class="container">
    <div class={styles.above}>
      <a href="/">
        <Home />
        <span>return home</span>
      </a>
    </div>
    <div class={styles.content}>
      <h1>{title || "An error occurred"}</h1>
      {#if subtitle || error}
        <h2>{subtitle || error?.message}</h2>
      {/if}
      {#if message}
        <span>{message}</span>
      {/if}
    </div>
  </div>
</div>
