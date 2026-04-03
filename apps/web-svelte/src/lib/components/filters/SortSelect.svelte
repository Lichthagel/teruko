<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";

  import { filters } from "$lib/filters.svelte.js";

  import { ArrowDownNarrowWide } from "@lucide/svelte";
  import styles from "client-css/m/filters.module.scss";
  import { zImageSort } from "models";

  const handleInput: FormEventHandler<HTMLSelectElement> = (event) => {
    event.preventDefault();

    const parsedSort = zImageSort.parse(event.currentTarget.value);

    filters.sort = parsedSort;
  };
</script>

<div class={styles.sort}>
  <ArrowDownNarrowWide class={styles.icon} />

  <select
    oninput={handleInput}
    value={filters.sort}
  >
    <option value="NEWEST">newest</option>
    <option value="OLDEST">oldest</option>
    <option value="RANDOM">random</option>
  </select>
</div>
