<script setup lang="ts">
import { ImageSort, zImageSort } from "models";

const route = useRoute();

const sort = ref<ImageSort>(
  zImageSort.nullish().parse(route.query.sort) ?? "NEWEST"
);

const sortChange = () => {
  navigateTo({
    query: {
      ...route.query,
      sort: sort.value,
    },
  });
};

watch(route, () => {
  sort.value = zImageSort.nullish().parse(route.query.sort) ?? "NEWEST";
});
</script>

<template>
  <select
    v-model="sort"
    class="h-10 w-24 rounded bg-base-100 px-2"
    @change="sortChange"
  >
    <option value="NEWEST">newest</option>
    <option value="OLDEST">oldest</option>
    <option value="RANDOM">random</option>
  </select>
</template>
