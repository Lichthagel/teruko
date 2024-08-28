<script setup lang="ts">
const props = defineProps<{
  fetching: boolean;
  error: boolean;
}>();
</script>

<template>
  <div
    :class="{
      'bg-error': props.error,
      'animate-load bg-primary': props.fetching,
    }"
    class="fixed bottom-0 left-0 right-0 z-10 h-1"
  />
</template>
