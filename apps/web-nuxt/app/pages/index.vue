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
      :sort="sort"
      :tags="tags"
    />
  </div>
</template>
