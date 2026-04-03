<script setup lang="ts">
import type { ImageExt } from "models";
import styles from "client-css/m/gallery.module.scss";

const props = defineProps<{
  image: ImageExt;
}>();

const { tags } = useFilters();

const setTag = (slug: string) => {
  tags.value = [slug];
};
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
          @click="() => setTag(tag.slug)"
        >
          {{ tag.slug }}
        </button>
      </template>
    </div>
  </div>
</template>
