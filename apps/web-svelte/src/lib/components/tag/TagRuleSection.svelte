<script lang="ts">
  import type { TagRuleExt } from "models";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import TagRuleAddRow from "./TagRuleAddRow.svelte";
  import TagRuleRow from "./TagRuleRow.svelte";

  const { slug }: { slug: string } = $props();

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

<h1>Rules</h1>
<h2>Outgoing rules</h2>
<div class="list">
  {#each $result.data?.tag.rules as rule}
    <TagRuleRow {rule} mode="outgoing" />
  {/each}
  {#if !$result.data?.tag.rules.length}
    <span>No rules</span>
  {/if}
  <TagRuleAddRow mode="outgoing" tagSlug={slug} />
</div>

<h2>Incoming rules</h2>
<div class="list">
  {#each $result.data?.tag.referencingRules as rule}
    <TagRuleRow {rule} mode="incoming" />
  {/each}
  {#if !$result.data?.tag.referencingRules.length}
    <span>No rules</span>
  {/if}
  <TagRuleAddRow mode="incoming" otherTagSlug={slug} />
</div>

<style>
.list {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
</style>
