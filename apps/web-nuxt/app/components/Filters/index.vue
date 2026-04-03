<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ListX } from "@lucide/vue";
import styles from "client-css/m/filters.module.scss";
import SortSelect from "./SortSelect.vue";
import TagQuery from "./TagQuery.vue";
import TagSearch from "./TagSearch.vue";

const { tags } = useFilters();

const resetTags = () => {
  tags.value = [];
};
</script>

<template>
  <div :class="styles.main">
    <div
      v-if="tags.length > 0"
      :class="styles['tag-container']"
    >
      <TagQuery
        v-for="tag in tags"
        :key="tag"
        :tag="tag"
      />
      <div :class="[styles['tag-query'], styles.reset]">
        <button @click="resetTags">
          <ListX />
        </button>
      </div>
    </div>

    <TagSearch />

    <SortSelect />
  </div>
</template>
