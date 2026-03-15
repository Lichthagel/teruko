<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte";
  import type { TagRuleExt } from "models";
  import { Trash } from "@lucide/svelte";
  import { getContextClient, gql, mutationStore } from "@urql/svelte";
  import Button from "../common/Button.svelte";

  const { rule, mode }: { rule: TagRuleExt; mode: "outgoing" | "incoming" } = $props();

  const client = getContextClient();

  let result = $state<OperationResultStore<{ deleteTagRule: boolean }>>();
  const deleteRule = () => {
    result = mutationStore({
      client,
      query: gql`
        mutation DeleteTagRule($id: Int!) {
          deleteTagRule(id: $id)
        }
      `,
      variables: { id: rule.id },
    });
  };
</script>

<div class="row">
  {#if mode === "incoming"}
    <div>{rule.tag.slug}</div>
  {/if}
  <div>{rule.kind}</div>
  {#if mode === "outgoing"}
    <div>{rule.otherTag?.slug}</div>
  {/if}
  <Button
    style="flex-grow: 0;"
    icon={Trash}
    disabled={$result?.fetching}
    onclick={(e) => {
      e.preventDefault();
      deleteRule();
    }} />
</div>

<style>
.row {
  display: flex;
  gap: .5rem;
  align-items: center;

  :global * {
    flex: 1 0;
  }
}
</style>
