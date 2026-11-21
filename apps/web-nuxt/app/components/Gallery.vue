<script setup lang="ts">
import type { ImageSort } from "models";
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import styles from "client-css/m/gallery.module.scss";
import { galleryState, initialGalleryLayout, virtualCardStyle, virtualGalleryOptions, watchGallery } from "client-graphql/gallery";
import { useImages } from "#imports";

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

const state = galleryState(props.tags, props.sort);
const gallery = ref<HTMLDivElement>();
const layout = shallowRef(initialGalleryLayout(state));
const virtualizer = useWindowVirtualizer<HTMLDivElement>(computed(() => virtualGalleryOptions(images.value, state, layout.value)));
onMounted(() => {
  const dispose = watchGallery(gallery.value!, state, (value) => {
    layout.value = value;
  }, () => virtualizer.value.takeSnapshot(), (index) => {
    virtualizer.value.scrollToIndex(index, { align: "start" });
    virtualizer.value.cancelScroll();
  });
  onBeforeUnmount(dispose);
});
watchEffect(() => {
  const last = virtualizer.value.getVirtualItems().at(-1);
  if (last && last.index >= images.value.length - layout.value.columns * 3 && !fetching.value) {
    fetchMore();
  }
});
</script>

<template>
  <div ref="gallery" :class="styles.gallery" :style="{ height: `${virtualizer.getTotalSize()}px` }" data-gallery :data-gallery-count="images.length">
    <div
      v-for="item in virtualizer.getVirtualItems()"
      :key="item.key"
      :ref="node => virtualizer.measureElement(node as HTMLElement | null)"
      :data-index="item.index"
      :class="styles['virtual-card']"
      :style="virtualCardStyle(item, layout)"
    >
      <ImageCard :image="images[item.index]!" />
    </div>
  </div>
  <div :class="styles.sentinel" />

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
