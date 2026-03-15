<script lang="ts">
  import StatusBar from "$lib/components/status/StatusBar.svelte";
  import { filters } from "$lib/filters.svelte.js";
  import { Pencil, X } from "@lucide/svelte";
  import { getContextClient, queryStore } from "@urql/svelte";
  import styles from "client-css/m/filters.module.scss";
  import { Tag } from "client-graphql/snippets";
  import TagRuleDialog from "../tag/TagRuleDialog.svelte";

  type Props = {
    tag: string;
  };

  const { tag }: Props = $props();

  let dialogOpen = $state(false);

  const client = getContextClient();

  const result = queryStore({
    client,
    query: Tag,
    variables: { slug: tag },
  });

  const removeTag = () => {
    const newTags = filters.tags.filter(t => t !== tag);

    filters.tags = newTags;
  };
</script>

<div
  class={styles["tag-query"]}
  style:background-color={$result.data?.tag.category?.color}
>
  <span>{tag}</span>
  <button
    onclick={(e) => {
      e.preventDefault();
      dialogOpen = true;
    }}
    type="button">
    <Pencil />
  </button>
  <button
    onclick={(e) => {
      e.preventDefault();
      removeTag();
    }}
    type="button"
  >
    <X />
  </button>
</div>

<TagRuleDialog bind:open={dialogOpen} />

<StatusBar error={!!$result.error} fetching={$result.fetching} />
