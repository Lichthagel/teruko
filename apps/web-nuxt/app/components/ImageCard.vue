<script setup lang="ts">
import type { ImageExt } from "models";
import styles from "client-css/m/gallery.module.scss";
import { tagsStore } from "client-stores";

const props = defineProps<{
  image: ImageExt;
}>();
</script>

<template>
  <div
    :class="styles.card"
  >
    <NuxtLink :href="`/${props.image.id}`">
      <div :class="styles['image-container']">
        <img
          :height="props.image.height"
          :src="`/img/${props.image.filename}`"
          :width="props.image.width"
        >

        <div
          v-if="!!props.image.title"
        >
          {{ props.image.title }}
        </div>
      </div>
    </NuxtLink>
    <div
      :class="styles['tag-list']"
    >
      <template
        v-for="tag in props.image.tags?.filter(
          (tag) => !tag.slug.startsWith('artist_'),
        )"
        :key="tag.slug"
      >
        <button
          :style="{ backgroundColor: tag.category?.color ?? 'gray' }"
          type="button"
          @click="() => tagsStore.set([tag.slug])"
        >
          {{ tag.slug }}
        </button>
      </template>
    </div>
  </div>
</template>
