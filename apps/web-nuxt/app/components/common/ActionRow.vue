<script setup lang="ts">
import styles from "client-css/m/form.module.scss";
</script>

<template>
  <div :class="styles.actionRow">
    <slot />
  </div>
</template>
