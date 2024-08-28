<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";

  import { sortStore } from "client-common/stores";
  import { ArrowDownNarrowWide } from "lucide-svelte";
  import { zImageSort } from "models";

  const handleInput: FormEventHandler<HTMLSelectElement> = (event) => {
    const parsedSort = zImageSort.parse(event.currentTarget.value);

    sortStore.set(parsedSort);
  };
</script>

<div class="relative inline-flex h-10 items-center gap-1 rounded bg-base-200 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
>
  <ArrowDownNarrowWide class="absolute left-2" />

  <!-- class="h-10 w-24 rounded bg-white px-2 focus:outline focus:outline-primary focus:outline-2" -->
  <select
    class="w-full bg-transparent pl-11 pr-2"
    on:input|preventDefault={handleInput}
    value={$sortStore || "NEWEST"}
  >
    <option value="NEWEST">newest</option>
    <option value="OLDEST">oldest</option>
    <option value="RANDOM">random</option>
  </select>
</div>
