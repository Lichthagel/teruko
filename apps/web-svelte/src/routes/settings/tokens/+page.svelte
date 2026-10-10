<script lang="ts">
  import styles from "client-css/m/tokens.module.scss";

  type TokenStatus = { active: boolean; createdAt: string | null };
  type Props = { data: { status: TokenStatus } };

  const { data }: Props = $props();
  let status = $state<TokenStatus | null>(null);
  const tokenStatus = $derived(status ?? data.status);
  let secret = $state("");
  let busy = $state(false);
  let error = $state("");

  const request = async () => {
    const response = await fetch("/api/settings/tokens", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const result = response.status === 204 ? null : await response.json();
    if (!response.ok)
      throw new Error(result?.error ?? "Token request failed");
    return result;
  };

  const refresh = async () => {
    const response = await fetch("/api/settings/tokens", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error ?? "Could not load tokens");
    status = result;
  };

  const create = async () => {
    busy = true;
    error = "";
    try {
      const result = await request();
      if (result?.token) {
        secret = result.token;
      }
      await refresh();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : String(cause);
    } finally {
      busy = false;
    }
  };

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
      <button class={styles.primaryButton} type="button" disabled={busy} onclick={create}>
        {busy ? "Working..." : "Generate / reset token"}
      </button>
    </div>
    {#if secret}
      <div class={styles.notice} role="status">Copy your token now; it will only be shown once.</div>
      <pre class={styles.tokenSecret} aria-label="New bearer token">{secret}</pre>
    {/if}
    {#if error}<p class={styles.error} role="alert">{error}</p>{/if}
  </section>

  <section class={styles.card} aria-labelledby="status-heading">
    <h2 id="status-heading" class={styles.sectionTitle}>Token status</h2>
    {#if tokenStatus.active}
      <p class={styles.muted}>Active{tokenStatus.createdAt ? ` since ${tokenStatus.createdAt.slice(0, 16).replace("T", " ")} UTC` : ""}.</p>
    {:else}
      <p class={styles.muted}>No active token.</p>
    {/if}
  </section>

  <div class={styles.footer}>
    <form method="post" action="/auth/logout"><button class={styles.secondaryButton} type="submit">Sign out</button></form>
  </div>
</main>
