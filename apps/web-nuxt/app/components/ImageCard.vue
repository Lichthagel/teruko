<script setup lang="ts">
import styles from "client-css/m/gallery.module.scss";
import { tagsStore } from "client-stores";
import { type ImageExt } from "models";

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
        :key="tag.slug"
        v-for="tag in props.image.tags?.filter(
          (tag) => !tag.slug.startsWith('artist_'),
        )"
      >
        <button
          :style="{ backgroundColor: tag.category?.color ?? 'gray' }"
          @click="() => tagsStore.set([tag.slug])"
          type="button"
        >
          {{ tag.slug }}
        </button>
      </template>
    </div>
  </div>
</template>
