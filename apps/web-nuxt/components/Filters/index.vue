<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { tagsStore } from "client-stores";
import { ListX } from "lucide-vue-next";

import SortSelect from "./SortSelect.vue";
import TagQuery from "./TagQuery.vue";
import TagSearch from "./TagSearch.vue";

const tags = useStore(tagsStore);
</script>

<template>
  <div class="mb-2">
    <div
      class="inline-flex"
      v-if="tags.length > 0"
    >
      <TagQuery
        :key="tag"
        :tag="tag"
        v-for="tag in tags"
      />
      <button
        @click="() => tagsStore.set([])"
        class="m-0.5 box-border inline-block h-10 w-10 rounded bg-neutral px-2 text-neutral-content transition hover:brightness-75"
      >
        <ListX class="h-6 w-6" />
      </button>
    </div>

    <TagSearch />

    <SortSelect />
  </div>
</template>
