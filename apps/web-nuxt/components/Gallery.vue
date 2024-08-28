<script setup lang="ts">
import { type ComponentPublicInstance, useImages } from "#imports";
import { type ImageSort } from "models";

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
    class="grid grid-cols-1 grid-rows-masonry gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5"
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
