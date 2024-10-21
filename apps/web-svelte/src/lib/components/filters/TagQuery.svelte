<script lang="ts">
  import type { TagExt } from "models";

  import StatusBar from "$lib/components/status/StatusBar.svelte";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import styles from "client-css/m/filters.module.scss";
  import { tagsStore } from "client-stores";
  import { X } from "lucide-svelte";

  type Props = {
    tag: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { tag }: Props = $props();

  const client = getContextClient();

  const result = queryStore<{ tag: TagExt }>({
    client,
    query: gql`
      query Tag($slug: String!) {
        tag(slug: $slug) {
          category {
            color
          }
        }
      }
    `,
    variables: { slug: tag },
  });

  const removeTag = () => {
    const newTags = $tagsStore.filter((t) => t !== tag);

    tagsStore.set(newTags);
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
      removeTag();
    }}
    type="button"
  >
    <X />
  </button>
</div>

<StatusBar error={!!$result.error} fetching={$result.fetching} />
