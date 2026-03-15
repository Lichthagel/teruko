<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte";
  import type { TagRule } from "models";
  import { Plus } from "@lucide/svelte";
  import { getContextClient, gql, mutationStore } from "@urql/svelte";
  import Button from "../common/Button.svelte";
  import Input from "../common/Input.svelte";
  import Select from "../common/Select.svelte";

  const { mode, ...restProps }: { mode: "outgoing"; tagSlug: string } | { mode: "incoming"; otherTagSlug: string } = $props();

  const client = getContextClient();

  let tagSlug = $state("");
  let ruleKind = $state<TagRule["kind"]>("implies");
  let otherTagSlug = $state("");

  let result = $state<OperationResultStore<{ createTagRule: Pick<TagRule, "id" | "kind"> & { tag: { slug: string }; otherTag?: { slug: string } } }>>();
  const createRule = () => {
    if (!tagSlug.length || !otherTagSlug.length) {
      return;
    }

    result = mutationStore({
      client,
      query: gql`
        mutation CreateTagRule($ruleKind: String!, $tagSlug: String!, $otherTagSlug: String) {
          createTagRule(
            ruleKind: $ruleKind
            tagSlug: $tagSlug
            otherTagSlug: $otherTagSlug
          ) {
            id
            kind
            otherTag {
              slug
            }
            tag {
              slug
            }
          }
        }
      `,
      variables: {
        tagSlug,
        ruleKind,
        otherTagSlug,
      },
    });
  };

  $effect(() => {
    if ("tagSlug" in restProps) {
      tagSlug = restProps.tagSlug;
      otherTagSlug = "";
    } else if ("otherTagSlug" in restProps) {
      tagSlug = "";
      otherTagSlug = restProps.otherTagSlug;
    }
  });
</script>

<div class="row">
  {#if mode === "incoming"}
    <Input type="text" placeholder="Tag Slug" bind:value={tagSlug} />
  {/if}
  <Select
    options={mode === "outgoing" ? ["implies", "delete"] : ["implies"]}
    value={ruleKind}
    setValue={v => ruleKind = v as TagRule["kind"]}
  />
  {#if mode === "outgoing"}
    <Input type="text" placeholder="Tag Slug" bind:value={otherTagSlug} />
  {/if}
  <Button
    style="flex-grow: 0;"
    icon={Plus}
    disabled={$result?.fetching}
    onclick={(e) => {
      e.preventDefault();
      createRule();
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
