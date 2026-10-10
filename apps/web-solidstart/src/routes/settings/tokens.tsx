import { Title } from "@solidjs/meta";
import styles from "client-css/m/tokens.module.scss";
import { createSignal, onMount, Show } from "solid-js";

type TokenStatus = { active: boolean; createdAt: string | null };

export default function TokenSettings() {
  const [status, setStatus] = createSignal<TokenStatus>({ active: false, createdAt: null });
  const [secret, setSecret] = createSignal("");
  const [error, setError] = createSignal("");
  const [busy, setBusy] = createSignal(false);

  const refresh = async () => {
    const response = await fetch("/api/settings/tokens", { cache: "no-store" });
    const result = await response.json();
    if (response.status === 401) {
      location.assign(`/login?returnTo=${encodeURIComponent("/settings/tokens")}`);
      return;
    }
    if (!response.ok)
      throw new Error(result.error ?? "Could not load token status");
    setStatus(result);
  };

  onMount(() => {
    void refresh().catch((cause) => {
      setError(cause instanceof Error ? cause.message : String(cause));
    });
  });

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/settings/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const result = await response.json();
      if (response.status === 401) {
        location.assign(`/login?returnTo=${encodeURIComponent("/settings/tokens")}`);
        return;
      }
      if (!response.ok)
        throw new Error(result.error ?? "Could not create token");
      setSecret(result.token);
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main class={styles.page}>
      <Title>Userscript access - てる子</Title>
      <div class={styles.eyebrow}>Account settings</div>
      <h1 class={styles.title}>Userscript access</h1>
      <p class={styles.intro}>Generate a bearer token for the Pixiv userscript, then paste it into your userscript settings. The secret appears only once.</p>

      <section class={styles.card} aria-labelledby="create-heading">
        <h2 id="create-heading" class={styles.sectionTitle}>Personal access</h2>
        <p class={styles.muted}>Treat this token like a password. Generating a replacement immediately invalidates the previous one.</p>
        <div class={styles.actions}>
          <button class={styles.primaryButton} type="button" disabled={busy()} onClick={() => void create()}>
            {busy() ? "Working..." : "Generate / reset token"}
          </button>
        </div>
        <Show when={secret()}>
          <div class={styles.notice} role="status">Copy this secret now. It will not be displayed again.</div>
          <pre class={styles.tokenSecret} aria-label="New bearer token">{secret()}</pre>
        </Show>
        <Show when={error()}><p class={styles.error} role="alert">{error()}</p></Show>
      </section>

      <section class={styles.card} aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" class={styles.sectionTitle}>Current userscript token</h2>
        <Show when={status().active} fallback={<p class={styles.muted}>No active token. Generate one to connect the userscript.</p>}>
          <p class={styles.muted}>
            An active token was generated
            {status().createdAt ? ` on ${status().createdAt!.slice(0, 16).replace("T", " ")} UTC` : ""}
            . Generate a new one to invalidate and replace it.
          </p>
        </Show>
      </section>

      <div class={styles.footer}>
        <form method="post" action="/auth/logout"><button class={styles.secondaryButton} type="submit">Sign out</button></form>
      </div>
    </main>
  );
}
