<script setup lang="ts">
import type { Tag, TagCategory } from "models";
import { BadgeCheck } from "@lucide/vue";
import styles from "client-css/m/imagepage.module.scss";

const props = defineProps<{
  tag: Pick<Tag, "slug" | "approved"> & { category?: Pick<TagCategory, "color"> | null };
}>();

const router = useRouter();

const { tags } = useFilters();

const onClick = () => {
  tags.value = [props.tag.slug];
  void router.push("/");
};
</script>

<template>
  <button
    :class="styles['tag-chip']"
    :style="{ 'background-color': props.tag.category?.color ?? undefined }"
    @click="onClick"
  >
    <span>{{ props.tag.slug }}</span>
    <BadgeCheck v-if="props.tag.approved" :size="16" />
  </button>
</template>
