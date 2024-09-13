<script lang="ts">
  import type { TagExt } from "models";

  import StatusBar from "$lib/components/status/StatusBar.svelte";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import { tagsStore } from "client-stores";
  import { X } from "lucide-svelte";

  export let tag: string;

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
  class="m-0.5 flex h-10 select-none items-center whitespace-nowrap rounded bg-gray-500 px-2 text-white"
  style:background-color={$result.data?.tag.category?.color}
>
  <span class="mx-1">{tag}</span>
  <button
    class="mx-1 rounded transition hover:bg-black/20"
    on:click|preventDefault={() => removeTag()}
  >
    <X />
  </button>
</div>

<StatusBar error={!!$result.error} fetching={$result.fetching} />
