<script setup lang="ts">
import { ImageExt } from "models";

const props = defineProps<{
  image: ImageExt;
}>();
</script>

<template>
  <div
    class="mb-1 bg-zinc-300 shadow-xl animate-in fade-in slide-in-from-bottom duration-500 dark:bg-gray-700"
  >
    <NuxtLink :href="`/${props.image.id}`">
      <div class="relative">
        <img
          :src="`/img/${props.image.filename}`"
          :width="props.image.width"
          :height="props.image.height"
        />

        <div
          v-if="!!props.image.title"
          class="text-shadow-xl absolute bottom-0 left-0 right-0 z-10 overflow-hidden whitespace-nowrap bg-gradient-to-b from-transparent to-black/80 px-1 text-sm text-white"
        >
          {{ props.image.title }}
        </div>
      </div>
    </NuxtLink>
    <div
      class="scrollbar-none snap flex snap-x flex-row flex-nowrap overflow-x-scroll"
    >
      <template
        v-for="tag in props.image.tags?.filter(
          (tag) => !tag.slug.startsWith('artist_')
        )"
        :key="tag.slug"
      >
        <NuxtLink
          class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-1 text-sm text-white transition hover:brightness-75"
          :href="`/?tag=${encodeURIComponent(tag.slug)}`"
          :style="{ backgroundColor: tag.category?.color ?? 'gray' }"
        >
          {{ tag.slug }}
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
