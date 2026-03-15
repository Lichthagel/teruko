<script lang="ts">
  import { filters } from "$lib/filters.svelte.js";

  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import { zImageSort } from "models";
  import Select from "../common/Select.svelte";

  const setValue = (value?: string) => {
    const parsedSort = zImageSort.parse(value);

    filters.sort = parsedSort;
  };
</script>

<Select
  options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
  icon={ArrowDownNarrowWide}
  value={filters.sort}
  {setValue}
/>
