<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import styles from "client-css/m/filters.module.scss";
import { sortStore } from "client-stores";
import { ArrowDownNarrowWide } from "lucide-vue-next";
import { type ImageSort } from "models";

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
      @change="sortChange"
      v-model="sortSel"
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
