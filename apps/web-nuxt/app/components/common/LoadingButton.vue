<script setup lang="ts">
import styles from "client-css/m/form.module.scss";

withDefaults(defineProps<{
  loading?: boolean;
  loadingLabel?: string;
  type?: "button" | "submit" | "reset";
}>(), {
  loading: false,
  loadingLabel: "Loading",
  type: "button",
});
</script>

<template>
  <button
    :class="styles.buttonPrimary"
    :type="type"
    :disabled="loading"
    :aria-busy="loading"
    :aria-label="loading ? loadingLabel : undefined"
  >
    <slot />
  </button>
</template>
