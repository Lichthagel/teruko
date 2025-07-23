<script setup lang="ts">
import styles from "client-css/m/status.module.scss";

const { error, fetching } = defineProps<{
  fetching: boolean;
  error: boolean;
}>();
</script>

<template>
  <div
    :class="[styles.bar, error && styles.error, fetching && styles.busy]"
  />
</template>
