<script setup lang="ts">
import { Home } from "lucide-vue-next";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  title?: string;
  subtitle?: string;
  message?: string;
  error?: Error;
}>();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="container">
      <div class="my-3 px-8 text-white">
        <a
          class="flex flex-row items-center space-x-1"
          href="/"
        >
          <Home />
          <span>return home</span>
        </a>
      </div>
      <div
        class="rounded border-4 border-error bg-neutral p-8 text-neutral-content"
      >
        <h1 class="mb-2 text-5xl">
          {{ title || "An error occurred" }}
        </h1>
        <h2
          class="my-2 text-3xl"
          v-if="subtitle || error"
        >
          {{ subtitle || error?.message }}
        </h2>
        <span v-if="message">{{ message }}</span>
      </div>
    </div>
  </div>
</template>
