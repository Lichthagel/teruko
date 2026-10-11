<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";

  import styles from "client-css/m/tokens.module.scss";

  const { data, form }: PageProps = $props();

</script>

<svelte:head>
  <title>Userscript access - てる子</title>
</svelte:head>

<main class={styles.page}>
  <div class={styles.eyebrow}>Account settings</div>
  <h1 class={styles.title}>Userscript access</h1>
  <p class={styles.intro}>Create a token for the Pixiv userscript.</p>

  <section class={styles.card} aria-labelledby="create-heading">
    <h2 id="create-heading" class={styles.sectionTitle}>Access token</h2>
    <p class={styles.muted}>Resetting replaces your current token.</p>
    <div class={styles.actions}>
      <form method="POST" action="?/resetToken" use:enhance>
        <button class={styles.primaryButton} type="submit">Generate / reset token</button>
      </form>
    </div>
    {#if form?.token}
      <div class={styles.notice} role="status">Copy your token now; it will only be shown once.</div>
      <pre class={styles.tokenSecret} aria-label="New bearer token">{form.token}</pre>
    {/if}
    {#if form?.error}<p class={styles.error} role="alert">{form.error}</p>{/if}
  </section>

  <section class={styles.card} aria-labelledby="status-heading">
    <h2 id="status-heading" class={styles.sectionTitle}>Token status</h2>
    {#if data.status.active}
      <p class={styles.muted}>Active{data.status.createdAt ? ` since ${data.status.createdAt.slice(0, 16).replace("T", " ")} UTC` : ""}.</p>
    {:else}
      <p class={styles.muted}>No active token.</p>
    {/if}
  </section>

  <div class={styles.footer}>
    <form method="post" action="/auth/logout"><button class={styles.secondaryButton} type="submit">Sign out</button></form>
  </div>
</main>
