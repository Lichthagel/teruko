<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte";
  import type { UpdateTagResult } from "client-graphql/snippets";
  import { Save } from "@lucide/svelte";
  import { getContextClient, mutationStore, queryStore } from "@urql/svelte";
  import styles from "client-css/m/tag.module.scss";
  import { TagEdit, UpdateTag } from "client-graphql/snippets";
  import Button from "../common/Button.svelte";
  import Input from "../common/Input.svelte";
  import Select from "../common/Select.svelte";
  import SkeletonLoader from "../common/SkeletonLoader.svelte";

  const { slug, afterUpdate }: { slug: string; afterUpdate?: (newSlug?: string) => void } = $props();

  let slugInputValue = $state("");
  let categoryInputValue = $state<string>();

  $effect(() => {
    if (slug.length) {
      slugInputValue = slug;
    }
  });

  const client = getContextClient();

  const result = $derived(queryStore({
    client,
    query: TagEdit,
    variables: { slug },
  }));

  $effect(() => {
    categoryInputValue = $result.data?.tag?.category?.slug;
  });

  let resultUpdateTag = $state<OperationResultStore<UpdateTagResult>>();
  const updateTag = () => {
    resultUpdateTag = mutationStore({
      client,
      query: UpdateTag,
      variables: { slug, newSlug: slugInputValue, category: categoryInputValue },
    });
  };

  $effect(() => {
    if (afterUpdate && $resultUpdateTag?.data?.updateTag) {
      afterUpdate($resultUpdateTag.data.updateTag.slug);
    }
  });
</script>

<h1>Meta</h1>

{#if $result.fetching}
  <SkeletonLoader />
{:else if $result.data}
  <div class={styles.row}>
    <Input bind:value={slugInputValue} />
    <Select
      options={$result.data.tagCategories.map(v => v.slug) ?? []}
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

{/if}
