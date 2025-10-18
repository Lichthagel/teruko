<script setup lang="ts">
import type { ImageSort } from "models";
import { useStore } from "@nanostores/vue";
import styles from "client-css/m/filters.module.scss";
import { sortStore } from "client-stores";
import { ArrowDownNarrowWide } from "lucide-vue-next";

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
  <div :class="styles.sort">
    <ArrowDownNarrowWide :class="styles.icon" />

    <select
      v-model="sortSel"
      @change="sortChange"
    >
      <option value="NEWEST">
        newest
      </option>
      <option value="OLDEST">
        oldest
      </option>
      <option value="RANDOM">
        random
      </option>
    </select>
  </div>
</template>
