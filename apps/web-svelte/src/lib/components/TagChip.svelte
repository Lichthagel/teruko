<script lang="ts">
  import type { TagExt } from "$lib/models";

  export let tag: TagExt;
</script>

<a
  href={`/?tag=${tag.slug}`}
  class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
  style={tag.category?.color && `background-color: ${tag.category?.color}`}
>
  {tag.slug}
</a>
