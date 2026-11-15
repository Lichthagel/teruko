<script setup lang="ts">
useHead({
  title: "てる子",
});

const { tags, sort } = useFilters();
</script>

<template>
  <div class="container">
    <Filters />

    <Gallery
      :key="JSON.stringify([sort, tags])"
      :sort="sort"
      :tags="tags"
    />
  </div>
</template>
