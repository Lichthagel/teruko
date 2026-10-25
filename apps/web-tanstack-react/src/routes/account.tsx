import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import styles from "client-css/m/form.module.scss";
import { useState } from "react";
import CopyableSecret from "../components/common/CopyableSecret";
import LoadingButton from "../components/common/LoadingButton";
import PageLayout from "../components/common/PageLayout";
import Panel from "../components/common/Panel";

const requireAccount = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest, setResponseHeader } = await import("@tanstack/react-start/server");
  const { requireSessionUser } = await import("server-auth/auth");
  const request = getRequest();
  const user = await requireSessionUser(request);
  if (!user)
    throw redirect({ href: `/login?returnTo=${encodeURIComponent("/account")}` });
  setResponseHeader("Cache-Control", "no-store");
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
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const callResetToken = useServerFn(resetToken);

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await callResetToken();
      setSecret(result.token);
    } catch (cause) {
      setError(cause instanceof Error
        ? cause.message
        : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageLayout title="Account">
      <Panel id="token-heading" title="Token">
        <div className={styles.actionRow}>
          <LoadingButton loading={busy} loadingLabel="Regenerating token" type="button" onClick={() => void create()}>
            Regenerate
          </LoadingButton>
        </div>
        {secret && (
          <CopyableSecret key={secret} value={secret} label="Token" />
        )}
        {error && <p className={styles.formError} role="alert">{error}</p>}
      </Panel>
    </PageLayout>
  );
};

export const Route = createFileRoute("/account")({
  loader: () => requireAccount(),
  head: () => ({
    meta: [
      { title: "Account - てる子" },
    ],
  }),
  component: TokenSettings,
});
