<script setup lang="ts">
import styles from "client-css/m/checkbox.module.scss";

defineProps<{ label: string }>();
const model = defineModel<boolean>("checked");
</script>

<template>
  <label :class="styles.checkbox">
    <input
      type="checkbox"
      :checked="model"
      @input="e => model = (e.currentTarget as HTMLInputElement).checked"
    >
    <span :class="styles.checkmark" />
    <span>{{ label }}</span>
  </label>
</template>
