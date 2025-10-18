<script setup lang="ts">
import type { ComponentPublicInstance } from "#imports";
import type { ImageSort } from "models";
import { useImages } from "#imports";

import styles from "client-css/m/gallery.module.scss";

const props = defineProps<{
  tags: readonly string[];
  sort: ImageSort;
}>();

const {
  images,
  fetching,
  error,
  stale,
  fetchMore,
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
      v-for="image in images"
      :key="image.id"
    >
      <div :ref="image.id === images.at(-1)?.id ? endRef : undefined">
        <ImageCard :image="image" />
      </div>
    </template>
  </div>

  <ErrorMessage
    v-if="error"
    :error="error"
    :title="error.name"
  />

  <StatusBar
    :error="!!error"
    :fetching="fetching || stale"
  />

  <ScrollButtons />
</template>
