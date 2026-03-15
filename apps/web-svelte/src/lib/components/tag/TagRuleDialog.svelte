<script lang="ts">
  import type { TagRuleExt } from "models";
  import { Plus } from "@lucide/svelte";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import Button from "../common/Button.svelte";
  import Select from "../common/Select.svelte";
  import Dialog from "../Dialog.svelte";

  let { open = $bindable(false), slug }: { open?: boolean; slug: string } = $props();

  const client = getContextClient();

  const result = $derived(queryStore<{ tag: { rules: TagRuleExt[]; referencingRules: TagRuleExt[] } }>({
    client,
    query: gql`
      query Rules($slug: String!) {
        tag(slug: $slug) {
          slug
          rules {
            _id
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
            _id
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

  let outgoingRules = $state<TagRuleExt[]>([]);

  $effect(() => {
    outgoingRules = $result.data?.tag.rules ?? [];
  });

  $inspect(outgoingRules);
</script>

<Dialog bind:open={open} class="tag-dialog">
  <h1>Rules</h1>
  <h2>Outgoing rules</h2>
  <div>
    {#each outgoingRules as rule}
      <div class="row">
        <Select
          options={["implies", "delete"]}
          value={rule.kind}
          setValue={(value) => {
            if (value)
              rule.kind = value as "implies" | "remove";
          }}
        />
        <div>{rule.otherTag?.slug}</div>
      </div>
    {/each}
    {#if !outgoingRules.length}
      <span>No rules</span>
    {/if}
    <div>
      <Button icon={Plus}>
        Add rule
      </Button>
    </div>
  </div>

  <h2>Incoming rules</h2>
  <div>
    {#each $result.data?.tag.referencingRules as rule}
      <div class="row">
        <div>{rule.tag.slug}</div>
        <div>{rule.kind}</div>
      </div>
    {/each}
    {#if !$result.data?.tag.referencingRules.length}
      <span>No rules</span>
    {/if}
  </div>
</Dialog>

<style>
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
