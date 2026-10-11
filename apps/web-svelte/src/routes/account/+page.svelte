<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import styles from "client-css/m/form.module.scss";
  import CopyableSecret from "#lib/components/common/CopyableSecret.svelte";
  import LoadingButton from "#lib/components/common/LoadingButton.svelte";
  import PageLayout from "#lib/components/common/PageLayout.svelte";
  import Panel from "#lib/components/common/Panel.svelte";

  const { form }: PageProps = $props();
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Account - てる子</title>
</svelte:head>

<PageLayout title="Account">
  <Panel id="token-heading" title="Token">
    <div class={styles.actionRow}>
      <form method="POST" action="?/resetToken" use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          try {
            await update();
          } finally {
            submitting = false;
          }
        };
      }}>
        <LoadingButton
          loading={submitting}
          loadingLabel="Regenerating token"
          type="submit"
        >
          Regenerate
        </LoadingButton>
      </form>
    </div>
    {#if form?.token}
      {#key form.token}
        <CopyableSecret value={form.token} label="Token" />
      {/key}
    {/if}
    {#if form?.error}<p class={styles.formError} role="alert">{form.error}</p>{/if}
  </Panel>
</PageLayout>
