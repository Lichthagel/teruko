<script lang="ts">
  import { filters } from "$lib/filters.svelte.js";
  import { ListX, Search } from "@lucide/svelte";
  import styles from "client-css/m/filters.module.scss";
  import TagInput from "../common/TagInput.svelte";
  import SortSelect from "./SortSelect.svelte";
  import TagQuery from "./TagQuery.svelte";

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

  <TagInput icon={Search} onSubmit={v => filters.tags = [...filters.tags, v]} onEscape={() => filters.tags = []} />

  <SortSelect />
</div>
