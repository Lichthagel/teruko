<script setup lang="ts">
import { type TagExt } from "models";
import { tagsStore } from "client-common/stores";

const router = useRouter();

const props = defineProps<{
  tag: TagExt;
}>();

const onClick = () => {
  tagsStore.set([props.tag.slug]);
  router.push("/");
};
</script>

<template>
  <button
    class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
    :style="{ 'background-color': props.tag.category?.color ?? undefined }"
    @click="onClick"
  >
    {{ props.tag.slug }}
  </button>
</template>
