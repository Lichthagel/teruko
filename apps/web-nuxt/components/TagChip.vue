<script setup lang="ts">
import { TagExt } from "~/shared/models";

const props = defineProps<{
  tag: TagExt;
}>();
</script>

<template>
  <NuxtLink
    :href="`/?tag=${props.tag.slug}`"
    class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
    :style="{ backgroundColor: props.tag.category?.color }"
  >
    {{ props.tag.slug }}
  </NuxtLink>
</template>
