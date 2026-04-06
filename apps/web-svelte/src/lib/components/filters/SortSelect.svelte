<script lang="ts">
  import { filters } from "$lib/filters.svelte.js";

  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import { zImageSort } from "models";
  import Select from "../common/Select.svelte";

  const setValue = (value?: string) => {
    filters.sort = zImageSort.parse(value);
  };
</script>

<Select
  options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
  icon={ArrowDownNarrowWide}
  bind:value={() => filters.sort, v => setValue(v)}
/>
