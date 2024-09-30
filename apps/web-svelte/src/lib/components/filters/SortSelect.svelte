<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";

  import styles from "client-css/m/filters.module.scss";
  import { sortStore } from "client-stores";
  import { ArrowDownNarrowWide } from "lucide-svelte";
  import { zImageSort } from "models";

  const handleInput: FormEventHandler<HTMLSelectElement> = (event) => {
    const parsedSort = zImageSort.parse(event.currentTarget.value);

    sortStore.set(parsedSort);
  };
</script>

<div class={styles.sort}>
  <ArrowDownNarrowWide class={styles.icon} />

  <select
    on:input|preventDefault={handleInput}
    value={$sortStore || "NEWEST"}
  >
    <option value="NEWEST">newest</option>
    <option value="OLDEST">oldest</option>
    <option value="RANDOM">random</option>
  </select>
</div>
