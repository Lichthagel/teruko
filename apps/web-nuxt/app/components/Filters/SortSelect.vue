<script setup lang="ts">
import { ArrowDownNarrowWide } from "@lucide/vue";
import styles from "client-css/m/filters.module.scss";

const { sort } = useFilters();
</script>

<template>
  <div :class="styles.sort">
    <ArrowDownNarrowWide :class="styles.icon" />

    <select v-model="sort">
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
