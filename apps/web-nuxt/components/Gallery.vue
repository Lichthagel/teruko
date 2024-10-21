<script setup lang="ts">
import styles from "client-css/m/gallery.module.scss";
import { type ImageSort } from "models";

import { type ComponentPublicInstance, useImages } from "#imports";

const props = defineProps<{
  tags: readonly string[];
  sort: ImageSort;
}>();

const {
  images, fetching, error, stale, fetchMore,
} = useImages(
  toRef(() => props.tags),
  toRef(() => props.sort),
);

const observer = ref<IntersectionObserver>();

const endRef = (node: ComponentPublicInstance | Element | null) => {
  if (observer.value) {
    observer.value.disconnect();
  }

  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchMore();
    }
  });

  if (node) {
    observer.value.observe(node as Element);
  }
};
</script>

<template>
  <div
    :class="styles.gallery"
  >
    <template
      :key="image.id"
      v-for="image in images"
    >
      <div :ref="image.id === images.at(-1)?.id ? endRef : undefined">
        <ImageCard :image="image" />
      </div>
    </template>
  </div>

  <ErrorMessage
    :error="error"
    :title="error.name"
    v-if="error"
  />

  <StatusBar
    :error="!!error"
    :fetching="fetching || stale"
  />

  <ScrollButtons />
</template>
