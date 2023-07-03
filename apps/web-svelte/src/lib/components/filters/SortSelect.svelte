<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";
  import { sortStore } from "client-common/stores";
  import { zImageSort } from "models";

  const handleInput: FormEventHandler<HTMLSelectElement> = (event) => {
    const parsedSort = zImageSort.parse(event.currentTarget.value);

    sortStore.set(parsedSort);
  };
</script>

<select
  class="h-10 w-24 rounded bg-base-100 px-2"
  value={$sortStore || "NEWEST"}
  on:input|preventDefault={handleInput}
>
  <option value="NEWEST">newest</option>
  <option value="OLDEST">oldest</option>
  <option value="RANDOM">random</option>
</select>
