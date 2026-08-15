<script lang="ts">
  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import { filters } from "#lib/filters.svelte.js";
  import Select from "../common/Select.svelte";
</script>

<Select
  options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
  icon={ArrowDownNarrowWide}
  bind:value={filters.sort}
/>
