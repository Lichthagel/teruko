<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import styles from "client-css/m/filters.module.scss";
import { tagsStore } from "client-stores";

import SortSelect from "./SortSelect.vue";
import TagQuery from "./TagQuery.vue";
import TagSearch from "./TagSearch.vue";

const tags = useStore(tagsStore);
</script>

<template>
  <div :class="styles.main">
    <div
      :class="styles['tag-container']"
      v-if="tags.length > 0"
    >
      <TagQuery
        :key="tag"
        :tag="tag"
        v-for="tag in tags"
      />
      <!-- TODO <button
        @click="() => tagsStore.set([])"
        class="m-0.5 box-border inline-block h-10 w-10 rounded bg-neutral px-2 text-neutral-content transition hover:brightness-75"
      >
        <ListX class="h-6 w-6" />
      </button> -->
    </div>

    <TagSearch />

    <SortSelect />
  </div>
</template>
