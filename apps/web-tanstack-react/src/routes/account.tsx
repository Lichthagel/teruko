import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import styles from "client-css/m/tokens.module.scss";
import { useState } from "react";

type TokenStatus = { active: boolean; createdAt: string | null };

const getTokenStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest, setResponseHeader } = await import("@tanstack/react-start/server");
  const { requireSessionUser, userTokenStatus } = await import("server-auth/auth");
  const request = getRequest();
  const user = await requireSessionUser(request);
  if (!user)
    throw redirect({ href: `/login?returnTo=${encodeURIComponent("/account")}` });
  setResponseHeader("Cache-Control", "no-store");
  return userTokenStatus(user);
});

const resetToken = createServerFn({ method: "POST" }).handler(async () => {
  const { getRequest, getRequestUrl, setResponseHeader } = await import("@tanstack/react-start/server");
  const { requireSessionUser, resetUserToken } = await import("server-auth/auth");
  const request = getRequest();
  const user = await requireSessionUser(request);
  if (!user)
    throw redirect({ href: `/login?returnTo=${encodeURIComponent("/account")}` });
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
  const [status, setStatus] = useState<TokenStatus>(Route.useLoaderData());
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const callGetTokenStatus = useServerFn(getTokenStatus);
  const callResetToken = useServerFn(resetToken);

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await callResetToken();
      setSecret(result.token);
      setStatus(await callGetTokenStatus());
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
      <p className={styles.intro}>Create a token for the Pixiv userscript.</p>

      <section className={styles.card} aria-labelledby="create-heading">
        <h2 id="create-heading" className={styles.sectionTitle}>Access token</h2>
        <p className={styles.muted}>Resetting replaces your current token.</p>
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="button" disabled={busy} onClick={() => void create()}>
            {busy ? "Working..." : "Generate / reset token"}
          </button>
        </div>
        {secret && (
          <>
            <div className={styles.notice} role="status">Copy your token now; it will only be shown once.</div>
            <pre className={styles.tokenSecret} aria-label="New bearer token">{secret}</pre>
          </>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>

      <section className={styles.card} aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className={styles.sectionTitle}>Token status</h2>
        {status.active
          ? (
              <p className={styles.muted}>
                Active
                {status.createdAt ? ` since ${status.createdAt.slice(0, 16).replace("T", " ")} UTC` : ""}
                .
              </p>
            )
          : <p className={styles.muted}>No active token.</p>}
      </section>

      <div className={styles.footer}>
        <form method="post" action="/auth/logout"><button className={styles.secondaryButton} type="submit">Sign out</button></form>
      </div>
    </main>
  );
};

export const Route = createFileRoute("/account")({
  loader: () => getTokenStatus(),
  head: () => ({ meta: [{ title: "Userscript access - てる子" }] }),
  component: TokenSettings,
});
