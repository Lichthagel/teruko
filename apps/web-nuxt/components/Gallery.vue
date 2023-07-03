<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ImageSort } from "models";

const props = defineProps<{
  tags: readonly string[];
  sort: ImageSort;
}>();

const { images, fetching, error, stale, fetchMore } = useImages(
  toRef(() => props.tags),
  toRef(() => props.sort)
);

const observer = ref<IntersectionObserver>();

const endRef = (node: Element | ComponentPublicInstance | null) => {
  if (observer.value) observer.value.disconnect();

  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchMore();
    }
  });

  if (node) observer.value.observe(node as Element);
};
</script>

<template>
  <div
    class="grid grid-cols-1 grid-rows-masonry gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5"
  >
    <template v-for="image in images" :key="image.id">
      <div :ref="image.id === images.at(-1)?.id ? endRef : undefined">
        <ImageCard :image="image" />
      </div>
    </template>
  </div>

  <ErrorMessage v-if="error" :title="error.name" :error="error" />

  <StatusBar :fetching="fetching || stale" :error="!!error" />

  <ScrollButtons />
</template>
