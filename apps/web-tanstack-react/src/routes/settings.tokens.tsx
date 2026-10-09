import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import styles from "client-css/m/tokens.module.scss";
import { useState } from "react";

type TokenStatus = { active: boolean; createdAt: string | null };

const getTokenStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest, setResponseHeader } = await import("@tanstack/react-start/server");
  const { requireUser, userTokenStatus } = await import("server-graphql");
  const request = getRequest();
  const user = await requireUser(request);
  if (!user)
    throw redirect({ href: `/login?returnTo=${encodeURIComponent("/settings/tokens")}` });
  setResponseHeader("Cache-Control", "no-store");
  return userTokenStatus(user);
});

const resetToken = createServerFn({ method: "POST" }).handler(async () => {
  const { getRequest, getRequestUrl, setResponseHeader } = await import("@tanstack/react-start/server");
  const { requireUser, resetUserToken } = await import("server-graphql");
  const request = getRequest();
  const user = await requireUser(request);
  if (!user)
    throw new Error("Unauthorized");
  const origin = request.headers.get("origin");
  const requestUrl = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
  let originUrl: URL;
  try {
    originUrl = new URL(origin ?? "");
  } catch {
    throw new Error("Forbidden");
  }
  if (originUrl.origin !== requestUrl.origin)
    throw new Error("Forbidden");
  setResponseHeader("Cache-Control", "no-store");
  return resetUserToken(user);
});

const TokenSettings = () => {
  const initialStatus = Route.useLoaderData();
  const [status, setStatus] = useState<TokenStatus>(initialStatus);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const callGetTokenStatus = useServerFn(getTokenStatus);
  const callResetToken = useServerFn(resetToken);

  const refresh = async () => setStatus(await callGetTokenStatus());

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await callResetToken();
      setSecret(result.token);
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.eyebrow}>Account settings</div>
      <h1 className={styles.title}>Userscript access</h1>
      <p className={styles.intro}>Generate a bearer token for the Pixiv userscript, then paste it into your userscript settings. The secret appears only once.</p>

      <section className={styles.card} aria-labelledby="create-heading">
        <h2 id="create-heading" className={styles.sectionTitle}>Personal access</h2>
        <p className={styles.muted}>Treat this token like a password. Generating a replacement immediately invalidates the previous one.</p>
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="button" disabled={busy} onClick={() => void create()}>
            {busy ? "Working..." : "Generate / reset token"}
          </button>
        </div>
        {secret && (
          <>
            <div className={styles.notice} role="status">Copy this secret now. It will not be displayed again.</div>
            <pre className={styles.tokenSecret} aria-label="New bearer token">{secret}</pre>
          </>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>

      <section className={styles.card} aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className={styles.sectionTitle}>Current userscript token</h2>
        {status.active
          ? (
              <p className={styles.muted}>
                An active token was generated
                {status.createdAt ? ` on ${status.createdAt.slice(0, 16).replace("T", " ")} UTC` : ""}
                . Generate a new one to invalidate and replace it.
              </p>
            )
          : <p className={styles.muted}>No active token. Generate one to connect the userscript.</p>}
      </section>

      <div className={styles.footer}>
        <form method="post" action="/auth/logout"><button className={styles.secondaryButton} type="submit">Sign out</button></form>
      </div>
    </main>
  );
};

export const Route = createFileRoute("/settings/tokens")({
  loader: () => getTokenStatus(),
  head: () => ({ meta: [{ title: "Userscript access - てる子" }] }),
  component: TokenSettings,
});
