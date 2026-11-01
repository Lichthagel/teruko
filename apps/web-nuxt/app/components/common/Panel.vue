<script setup lang="ts">
import styles from "client-css/m/form.module.scss";

defineProps<{ id: string; title: string }>();
</script>

<template>
  <section :class="styles.panel" :aria-labelledby="id">
    <h2 :id="id" :class="styles.panelTitle">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
