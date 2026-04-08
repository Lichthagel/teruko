<script setup lang="ts">
import styles from "client-css/m/tag.module.scss";
import Dialog from "../common/Dialog.vue";
import TagEditSection from "./TagEditSection.vue";

const props = defineProps<{ slug: string }>();
const open = defineModel("open", {
  default: false,
});

const { tags } = useFilters();

const afterUpdate = (newSlug?: string) => {
  open.value = false;
  if (newSlug) {
    const idx = tags.value.findIndex(el => el === props.slug);
    if (idx >= 0) {
      tags.value = tags.value.toSpliced(idx, 1, newSlug);
    }
  }
};
</script>

<template>
  <Dialog v-model:open="open" :class="styles['tag-dialog']">
    <TagEditSection :slug="slug" @after-update="afterUpdate" />
  </Dialog>
</template>
