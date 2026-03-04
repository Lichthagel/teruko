<script lang="ts">
  import { ListX } from "@lucide/svelte";

  import styles from "client-css/m/filters.module.scss";

  import { tagsStore } from "client-stores";
  import SortSelect from "./SortSelect.svelte";
  import TagQuery from "./TagQuery.svelte";
  import TagSearch from "./TagSearch.svelte";

  const resetTags = (event: Event) => {
    event.preventDefault();
    tagsStore.set([]);
  };
</script>

<div class={styles.main}>
  {#if $tagsStore.length > 0}
    <div class={styles["tag-container"]}>
      {#each $tagsStore as tag (tag)}
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
