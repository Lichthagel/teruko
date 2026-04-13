<script lang="ts">
  import { filters } from "$lib/filters.svelte.js";
  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import Select from "../common/Select.svelte";
</script>

<Select
  options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
  icon={ArrowDownNarrowWide}
  bind:value={filters.sort}
/>
