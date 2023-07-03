<script setup lang="ts">
import { ImageSort } from "models";
import { useStore } from "@nanostores/vue";
import { sortStore } from "client-common/stores";

const sort = useStore(sortStore);

const sortSel = ref<ImageSort>(sort.value || "NEWEST"); // TODO initial selection

const sortChange = () => {
  sortStore.set(sortSel.value);
};

watch(sort, () => {
  sortSel.value = sort.value || "NEWEST";
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
