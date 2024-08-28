<script lang="ts">
  import type { TagExt } from "models";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { tagsStore } from "client-common/stores";

  export let tag: TagExt;

  const onClick = () => {
    tagsStore.set([tag.slug]);
    void goto(`${base}/`);
  };
</script>

<button
  class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
  on:click={onClick}
  style={tag.category?.color && `background-color: ${tag.category?.color}`}
>
  {tag.slug}
</button>
