<script lang="ts">
  import type { TagRuleExt } from "models";
  import { Plus } from "@lucide/svelte";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import Button from "../common/Button.svelte";
  import Select from "../common/Select.svelte";
  import Dialog from "../Dialog.svelte";
  import TagRuleRow from "./TagRuleRow.svelte";

  let { open = $bindable(false), slug }: { open?: boolean; slug: string } = $props();

  const client = getContextClient();

  const result = $derived(queryStore<{ tag: { rules: TagRuleExt[]; referencingRules: TagRuleExt[] } }>({
    client,
    query: gql`
      query Rules($slug: String!) {
        tag(slug: $slug) {
          slug
          rules {
            id
            tag {
              slug
              category {
                color
              }
            }
            otherTag {
              slug
              category {
                color
              }
            }
            kind
          }
          referencingRules {
            id
            otherTag {
              slug
              category {
                color
              }
            }
            tag {
              slug
              category {
                color
              }
            }
            kind
          }
        }
      }
    `,
    variables: { slug },
    pause: !open,
  }));
</script>

<Dialog bind:open={open} class="tag-dialog">
  <h1>Rules</h1>
  <h2>Outgoing rules</h2>
  <div class="list">
    {#each $result.data?.tag.rules as rule}
      <TagRuleRow {rule} mode="outgoing" />
    {/each}
    {#if !$result.data?.tag.rules.length}
      <span>No rules</span>
    {/if}
    <div class="row">
      <Select
        options={["implies", "delete"]}
        value="implies"
      />
      <div>TODO</div>
      <Button style="flex-grow: 0;" icon={Plus} />
    </div>
  </div>

  <h2>Incoming rules</h2>
  <div class="list">
    {#each $result.data?.tag.referencingRules as rule}
      <TagRuleRow {rule} mode="incoming" />
    {/each}
    {#if !$result.data?.tag.referencingRules.length}
      <span>No rules</span>
    {/if}
    <div class="row">
      <div>TODO</div>
      <Select
        options={["implies"]}
        value="implies"
      />
      <Button style="flex-grow: 0;" icon={Plus} />
    </div>
  </div>
</Dialog>

<style>
.list {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.row {
  display: flex;
  gap: .5rem;
  align-items: center;

  :global * {
    flex: 1 0;
  }
}

:global .tag-dialog {
  width: 50rem;
}
</style>
