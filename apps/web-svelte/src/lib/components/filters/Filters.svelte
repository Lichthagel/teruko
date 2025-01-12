<script lang="ts">
  import styles from "client-css/m/filters.module.scss";
  import { tagsStore } from "client-stores";
  import ListX from "lucide-svelte/icons/list-x";

  import SortSelect from "./SortSelect.svelte";
  import TagQuery from "./TagQuery.svelte";
  import TagSearch from "./TagSearch.svelte";

  const resetTags = () => {
    tagsStore.set([]);
  };
</script>

<div class={styles.main}>
  {#if $tagsStore.length > 0}
    <div class={styles["tag-container"]}>
      {#each $tagsStore as tag}
        {#key tag}
          <TagQuery {tag} />
        {/key}
      {/each}
      <div class={[styles["tag-query"], styles.reset]}>
        <button on:click|preventDefault={resetTags}>
          <ListX />
        </button>
      </div>
    </div>
  {/if}

  <TagSearch />

  <SortSelect />
</div>
