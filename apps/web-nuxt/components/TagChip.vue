<script setup lang="ts">
import { tagsStore } from "client-common/stores";
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
    :style="{ 'background-color': props.tag.category?.color ?? undefined }"
    @click="onClick"
    class="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
  >
    {{ props.tag.slug }}
  </button>
</template>
