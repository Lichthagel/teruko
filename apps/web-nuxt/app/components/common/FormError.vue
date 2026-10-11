<script setup lang="ts">
import styles from "client-css/m/form.module.scss";
</script>

<template>
  <p :class="styles.formError" role="alert">
    <slot />
  </p>
</template>
