<script setup lang="ts">
useHead({
  title: "てる子",
});

const { tags, sort } = useFilters();
</script>

<template>
  <div class="container mx-auto">
    <Filters />

    <Gallery :tags="tags" :sort="sort" />
  </div>
</template>
