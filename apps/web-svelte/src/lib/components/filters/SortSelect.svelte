<script lang="ts">
  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import { filters } from "#lib/filters.svelte.js";
  import Select from "../common/Select.svelte";

  const setValue = (value?: string) => {
    if (value && vImageSort.options.includes(value as typeof vImageSort.options[number])) {
      filters.sort = value as typeof filters.sort;
    }
  };
</script>

<Select
  options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
  icon={ArrowDownNarrowWide}
  bind:value={filters.sort}
/>
