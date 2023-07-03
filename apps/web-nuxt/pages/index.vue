<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { tagsStore, sortStore } from "client-common/stores";

useHead({
  title: "てる子",
});

const sort = useStore(sortStore);
const tags = useStore(tagsStore);
</script>

<template>
  <div class="container mx-auto">
    <Filters />

    <Gallery :tags="tags" :sort="sort || 'NEWEST'" />
  </div>
</template>
