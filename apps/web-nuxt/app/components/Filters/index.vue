<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import styles from "client-css/m/filters.module.scss";
import { tagsStore } from "client-stores";
import { ListX } from "lucide-vue-next";

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
      <div :class="[styles['tag-query'], styles.reset]">
        <button @click="() => tagsStore.set([])">
          <ListX />
        </button>
      </div>
    </div>

    <TagSearch />

    <SortSelect />
  </div>
</template>
