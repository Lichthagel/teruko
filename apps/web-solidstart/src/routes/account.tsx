import type { TokenStatus } from "../lib/server/account";
import { Title } from "@solidjs/meta";
import styles from "client-css/m/tokens.module.scss";
import { createSignal, onMount, Show } from "solid-js";
import { createAccountToken, getAccountTokenStatus } from "../lib/server/account";

export default function TokenSettings() {
  const [status, setStatus] = createSignal<TokenStatus>({ active: false, createdAt: null });
  const [secret, setSecret] = createSignal("");
  const [error, setError] = createSignal("");
  const [busy, setBusy] = createSignal(false);

  const refresh = async () => {
    const result = await getAccountTokenStatus();
    if (result.unauthorized) {
      location.assign(`/login?returnTo=${encodeURIComponent("/account")}`);
      return;
    }
    setStatus(result.status);
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
      const result = await createAccountToken();
      if (result.unauthorized) {
        location.assign(`/login?returnTo=${encodeURIComponent("/account")}`);
        return;
      }
      if ("error" in result)
        throw new Error(result.error);
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
      <p class={styles.intro}>Create a token for the Pixiv userscript.</p>

      <section class={styles.card} aria-labelledby="create-heading">
        <h2 id="create-heading" class={styles.sectionTitle}>Access token</h2>
        <p class={styles.muted}>Resetting replaces your current token.</p>
        <div class={styles.actions}>
          <button class={styles.primaryButton} type="button" disabled={busy()} onClick={() => void create()}>
            {busy() ? "Working..." : "Generate / reset token"}
          </button>
        </div>
        <Show when={secret()}>
          <div class={styles.notice} role="status">Copy your token now; it will only be shown once.</div>
          <pre class={styles.tokenSecret} aria-label="New bearer token">{secret()}</pre>
        </Show>
        <Show when={error()}><p class={styles.error} role="alert">{error()}</p></Show>
      </section>

      <section class={styles.card} aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" class={styles.sectionTitle}>Token status</h2>
        <Show when={status().active} fallback={<p class={styles.muted}>No active token.</p>}>
          <p class={styles.muted}>
            Active
            {status().createdAt ? ` since ${status().createdAt!.slice(0, 16).replace("T", " ")} UTC` : ""}
            .
          </p>
        </Show>
      </section>

      <div class={styles.footer}>
        <form method="post" action="/auth/logout"><button class={styles.secondaryButton} type="submit">Sign out</button></form>
      </div>
    </main>
  );
}
