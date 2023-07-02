<script setup lang="ts">
const props = defineProps<{
  fetching: boolean;
  error: boolean;
}>();
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 h-1"
    :class="{
      'bg-error': props.error,
      'animate-load bg-primary': props.fetching,
    }"
  />
</template>
