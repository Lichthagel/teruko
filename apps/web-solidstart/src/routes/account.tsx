import { Title } from "@solidjs/meta";
import styles from "client-css/m/form.module.scss";
import { createSignal, onMount, Show } from "solid-js";
import CopyableSecret from "../components/common/CopyableSecret";
import LoadingButton from "../components/common/LoadingButton";
import PageLayout from "../components/common/PageLayout";
import Panel from "../components/common/Panel";
import { createAccountToken, hasAccountAccess } from "../lib/server/account";

export default function TokenSettings() {
  const [secret, setSecret] = createSignal("");
  const [error, setError] = createSignal("");
  const [busy, setBusy] = createSignal(false);

  onMount(() => {
    void hasAccountAccess().then((authorized) => {
      if (!authorized)
        location.assign(`/login?returnTo=${encodeURIComponent("/account")}`);
    }).catch((cause) => {
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
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageLayout title="Account">
      <Title>Account - てる子</Title>
      <Panel id="token-heading" title="Token">
        <div class={styles.actionRow}>
          <LoadingButton loading={busy()} loadingLabel="Regenerating token" type="button" onClick={() => void create()}>
            Regenerate
          </LoadingButton>
        </div>
        <Show when={secret()}>
          <CopyableSecret value={secret()} label="Token" />
        </Show>
        <Show when={error()}><p class={styles.formError} role="alert">{error()}</p></Show>
      </Panel>
    </PageLayout>
  );
}
