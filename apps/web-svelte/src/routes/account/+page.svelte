<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import ActionRow from "#lib/components/common/ActionRow.svelte";
  import CopyableSecret from "#lib/components/common/CopyableSecret.svelte";
  import FormError from "#lib/components/common/FormError.svelte";
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
    <ActionRow>
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
    </ActionRow>
    {#if form?.token}
      {#key form.token}
        <CopyableSecret value={form.token} label="Token" />
      {/key}
    {/if}
    {#if form?.error}<FormError>{form.error}</FormError>{/if}
  </Panel>
</PageLayout>
