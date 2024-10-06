<script setup lang="ts">
import styles from "client-css/m/imagepage.module.scss";
import { tagsStore } from "client-stores";
import { type TagExt } from "models";

const router = useRouter();

const props = defineProps<{
  tag: TagExt;
}>();

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
