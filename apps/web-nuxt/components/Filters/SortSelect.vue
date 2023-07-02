<script setup lang="ts">
import { ImageSort } from "models";

const { sort, setSort } = useFilters();

const sortSel = ref<ImageSort>(sort.value);

const sortChange = () => {
  setSort(sortSel.value);
};

watch(sort, () => {
  sortSel.value = sort.value;
});
</script>

<template>
  <select
    v-model="sortSel"
    class="h-10 w-24 rounded bg-base-100 px-2"
    @change="sortChange"
  >
    <option value="NEWEST">newest</option>
    <option value="OLDEST">oldest</option>
    <option value="RANDOM">random</option>
  </select>
</template>
