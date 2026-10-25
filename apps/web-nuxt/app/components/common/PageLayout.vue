<script setup lang="ts">
import styles from "client-css/m/form.module.scss";

defineProps<{ title: string }>();
</script>

<template>
  <main :class="styles.page">
    <h1 :class="styles.pageTitle">
      {{ title }}
    </h1>
    <slot />
  </main>
</template>
