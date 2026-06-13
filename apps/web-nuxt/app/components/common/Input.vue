<script setup lang="ts">
import styles from "client-css/m/input.module.scss";

const model = defineModel();
</script>

<template>
  <div :class="styles.container">
    <input
      v-model="model"
      type="text"
      v-bind="$attrs"
    >
  </div>
</template>
