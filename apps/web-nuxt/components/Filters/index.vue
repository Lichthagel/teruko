<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import SortSelect from "./SortSelect.vue";
import TagQuery from "./TagQuery.vue";
import TagSearch from "./TagSearch.vue";
import { ListX } from "lucide-vue-next";

const { tags, setTags } = useFilters();
</script>

<template>
  <div class="mb-2">
    <div v-if="tags.length > 0" class="inline-flex">
      <TagQuery v-for="tag in tags" :key="tag" :tag="tag" />
      <button
        class="m-0.5 box-border inline-block h-10 w-10 rounded bg-neutral px-2 text-neutral-content transition hover:brightness-75"
        @click="() => setTags(undefined)"
      >
        <ListX class="h-6 w-6" />
      </button>
    </div>

    <TagSearch />

    <SortSelect />
  </div>
</template>
