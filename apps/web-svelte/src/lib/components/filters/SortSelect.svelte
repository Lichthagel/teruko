<script lang="ts">
  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import { vImageSort } from "models";
  import { filters } from "#lib/filters.svelte.js";
  import Select from "../common/Select.svelte";

  const setValue = (value?: string) => {
    const parsedSort = vImageSort.parse(value);

    filters.sort = parsedSort;
  };
</script>

<Select
  options={[
    { value: "NEWEST", label: "newest" },
    { value: "OLDEST", label: "oldest" },
    { value: "RANDOM", label: "random" },
  ]}
  icon={ArrowDownNarrowWide}
  bind:value={() => filters.sort, v => setValue(v)}
/>
