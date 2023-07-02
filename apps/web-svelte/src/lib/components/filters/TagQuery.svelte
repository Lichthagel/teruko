<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import type { TagExt } from "models";
  import { X } from "lucide-svelte";
  import StatusBar from "$lib/components/status/StatusBar.svelte";

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

  $: tags = $page.url.searchParams.getAll("tag");

  const removeTag = () => {
    const newTags = tags.filter((t) => t !== tag);

    const url = new URL($page.url);

    url.searchParams.delete("tag");
    for (const t of newTags) url.searchParams.append("tag", t);

    void goto(url);
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

<StatusBar fetching={$result.fetching} error={!!$result.error} />
