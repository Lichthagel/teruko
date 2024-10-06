<script lang="ts">
  import styles from "client-css/m/filters.module.scss";
  import { tagsStore } from "client-stores";

  import SortSelect from "./SortSelect.svelte";
  import TagQuery from "./TagQuery.svelte";
  import TagSearch from "./TagSearch.svelte";

// const resetTags = () => {
  //   tagsStore.set([]);
  // };
</script>

<div class={styles.main}>
  <!-- TAG CHIPS -->

  {#if $tagsStore.length > 0}
    <div class={styles["tag-container"]}>
      {#each $tagsStore as tag}
        {#key tag}
          <TagQuery {tag} />
        {/key}
      {/each}
      <!-- TODO <button
        class="m-0.5 box-border inline-block h-10 w-10 rounded bg-neutral px-2 text-neutral-content transition hover:brightness-75"
        on:click|preventDefault={resetTags}
      >
        <ListX class="h-6 w-6" />
      </button> -->
    </div>
  {/if}

  <!-- TAG INPUT -->
  <TagSearch />

  <!-- SORT SELECT -->
  <SortSelect />
</div>
