<script setup lang="ts">
import { ArrowDownNarrowWide } from "@lucide/vue";
import Select from "../common/Select.vue";

const { sort } = useFilters();
</script>

<template>
  <Select
    v-model="sort"
    :options="[{ value: 'NEWEST', label: 'newest' }, { value: 'OLDEST', label: 'oldest' }, { value: 'RANDOM', label: 'random' }]"
    :icon="ArrowDownNarrowWide"
  />
</template>
