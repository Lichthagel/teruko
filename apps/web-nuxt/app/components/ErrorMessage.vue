<script setup lang="ts">
import styles from "client-css/m/error.module.scss";
import { Home } from "lucide-vue-next";

defineProps<{
  title?: string;
  subtitle?: string;
  message?: string;
  error?: Error;
}>();
</script>

<template>
  <div :class="styles.backdrop">
    <div class="container">
      <div :class="styles.above">
        <a
          href="/"
        >
          <Home />
          <span>return home</span>
        </a>
      </div>
      <div
        :class="styles.content"
      >
        <h1>
          {{ title || "An error occurred" }}
        </h1>
        <h2
          v-if="subtitle || error"
        >
          {{ subtitle || error?.message }}
        </h2>
        <span v-if="message">{{ message }}</span>
      </div>
    </div>
  </div>
</template>
