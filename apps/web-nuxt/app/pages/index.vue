<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { sortStore, tagsStore } from "client-stores";

useHead({
  title: "てる子",
});

const sort = useStore(sortStore);
const tags = useStore(tagsStore);
</script>

<template>
  <div class="container">
    <Filters />

    <Gallery
      :sort="sort || 'NEWEST'"
      :tags="tags"
    />
  </div>
</template>
