<script lang="ts">
  import { filters } from "$lib/filters.svelte.js";
  import { ListX } from "@lucide/svelte";
  import styles from "client-css/m/filters.module.scss";
  import SortSelect from "./SortSelect.svelte";
  import TagQuery from "./TagQuery.svelte";
  import TagSearch from "./TagSearch.svelte";

  const resetTags = (event: Event) => {
    event.preventDefault();
    filters.tags = [];
  };
</script>

<div class={styles.main}>
  {#if filters.tags.length > 0}
    <div class={styles["tag-container"]}>
      {#each filters.tags as tag (tag)}
        <TagQuery {tag} />
      {/each}
      <div class={[styles["tag-query"], styles.reset]}>
        <button onclick={resetTags}>
          <ListX />
        </button>
      </div>
    </div>
  {/if}

  <TagSearch />

  <SortSelect />
</div>
