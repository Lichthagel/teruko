<script setup lang="ts">
import type { TagExt } from "models";
import styles from "client-css/m/imagepage.module.scss";

const props = defineProps<{
  tag: TagExt;
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
    {{ props.tag.slug }}
  </button>
</template>
