<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { zImageSort } from "models";
  import type { FormEventHandler } from "svelte/elements";

  $: sort =
    zImageSort.nullish().parse($page.url.searchParams.get("sort")) ?? "NEWEST";

  const handleInput: FormEventHandler<HTMLSelectElement> = (event) => {
    const url = new URL($page.url);

    url.searchParams.set("sort", event.currentTarget.value);

    void goto(url);
  };
</script>

<select
  class="h-10 w-24 rounded bg-base-100 px-2"
  value={sort}
  on:input|preventDefault={handleInput}
>
  <option value="NEWEST">newest</option>
  <option value="OLDEST">oldest</option>
  <option value="RANDOM">random</option>
</select>
