<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import styles from "client-css/m/button.module.scss";

defineProps<{
  icon?: LucideIcon;
}>();
</script>

<template>
  <button :class="styles.button" type="button">
    <component :is="icon" v-if="icon" />
    <slot />
  </button>
</template>
