<script setup lang="ts">
import { ImageSort, zImageSort } from "models";

useHead({
  title: "てる子",
});

const route = useRoute();

const tags: ComputedRef<string[]> = computed(() => {
  if (Array.isArray(route.query.tag)) {
    return route.query.tag.filter((tag): tag is string => !!tag);
  } else if (typeof route.query.tag === "string") {
    return [route.query.tag];
  } else {
    return [];
  }
});

const sort: ComputedRef<ImageSort> = computed(
  () => zImageSort.nullish().parse(route.query.sort) ?? "NEWEST"
);
</script>

<template>
  <div class="container mx-auto">
    <Filters />

    <Gallery :tags="tags" :sort="sort" />
  </div>
</template>
