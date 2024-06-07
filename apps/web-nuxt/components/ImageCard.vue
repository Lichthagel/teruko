<script setup lang="ts">
import { ImageExt } from "models";
import { tagsStore } from "client-common/stores";

const props = defineProps<{
  image: ImageExt;
}>();
</script>

<template>
  <div
    class="mb-1 bg-zinc-300 shadow-xl duration-500 animate-in fade-in slide-in-from-bottom dark:bg-gray-700"
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
      class="snap flex snap-x flex-row flex-nowrap overflow-x-scroll scrollbar-none"
    >
      <template
        v-for="tag in props.image.tags?.filter(
          (tag) => !tag.slug.startsWith('artist_'),
        )"
        :key="tag.slug"
      >
        <button
          class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-1 text-sm text-white transition hover:brightness-75"
          :style="{ backgroundColor: tag.category?.color ?? 'gray' }"
          @click="() => tagsStore.set([tag.slug])"
        >
          {{ tag.slug }}
        </button>
      </template>
    </div>
  </div>
</template>
