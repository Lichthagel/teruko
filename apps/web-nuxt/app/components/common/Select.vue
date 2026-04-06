<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import styles from "client-css/m/select.module.scss";

defineProps<{
  icon?: LucideIcon;
  options: (string | { value: string; label: string })[];
}>();

const model = defineModel();
</script>

<template>
  <div :class="styles.select">
    <component :is="icon" v-if="icon" :class="styles.icon" />

    <select v-model="model">
      <option v-for="option in options" :key="(typeof option === 'string' ? option : option.value)" :value="typeof option === 'string' ? option : option.value">
        {{ typeof option === "string" ? option : option.label }}
      </option>
    </select>
  </div>
</template>
