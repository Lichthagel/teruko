<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte";
  import type { TagCategory, TagExt } from "models";
  import { Save } from "@lucide/svelte";
  import { getContextClient, gql, mutationStore, queryStore } from "@urql/svelte";
  import Button from "../common/Button.svelte";
  import Input from "../common/Input.svelte";
  import Select from "../common/Select.svelte";

  const { slug, onSubmit }: { slug: string; onSubmit?: (newSlug?: string) => void } = $props();

  let slugInputValue = $state("");
  let categoryInputValue = $state<string>();

  $effect(() => {
    if (slug.length) {
      slugInputValue = slug;
    }
  });

  const client = getContextClient();

  const result = $derived(queryStore<{ tag?: TagExt; tagCategories: TagCategory[] }>({
    client,
    query: gql`
      query TagEdit($slug: String!) {
        tag(slug: $slug) {
          slug
          category {
            _id
            slug
            color
          }
        }        
        tagCategories {
          _id
          color
          slug
        }
      }
    `,
    variables: { slug },
  }));

  $effect(() => {
    categoryInputValue = $result.data?.tag?.category?.slug;
  });

  let resultUpdateTag = $state<OperationResultStore<{ updateTag: TagExt }>>();
  const updateTag = () => {
    resultUpdateTag = mutationStore({
      client,
      query: gql`
        mutation UpdateTag($slug: String!, $newSlug: String, $category: String) {
          updateTag(slug: $slug, newSlug: $newSlug, category: $category) {
            slug
            category {
              slug
            }
          }
        }
      `,
      variables: { slug, newSlug: slugInputValue, category: categoryInputValue },
    });
  };

  $effect(() => {
    if (onSubmit && $resultUpdateTag?.data?.updateTag) {
      onSubmit($resultUpdateTag.data.updateTag.slug);
    }
  });
</script>

<h1>Meta</h1>

<div class="row">
  <Input bind:value={slugInputValue} />
  <Select
    options={$result.data?.tagCategories.map(v => v.slug) ?? []}
    bind:value={categoryInputValue}
  />
  <Button
    style="flex-grow: 0;"
    icon={Save}
    disabled={$resultUpdateTag?.fetching}
    onclick={(e) => {
      e.preventDefault();
      updateTag();
    }}
  />
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
