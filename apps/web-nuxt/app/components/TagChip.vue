<script setup lang="ts">
import type { TagExt } from "models";
import styles from "client-css/m/imagepage.module.scss";
import { tagsStore } from "client-stores";

const props = defineProps<{
  tag: TagExt;
}>();

const router = useRouter();

const onClick = () => {
  tagsStore.set([props.tag.slug]);
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
