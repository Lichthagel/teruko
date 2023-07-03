<script lang="ts">
  import { goto } from "$app/navigation";
  import type { TagExt } from "models";
  import { tags } from "server-common/stores";

  export let tag: TagExt;

  const onClick = () => {
    tags.set([tag.slug]);
    void goto("/");
  };
</script>

<button
  on:click={onClick}
  class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
  style={tag.category?.color && `background-color: ${tag.category?.color}`}
>
  {tag.slug}
</button>
