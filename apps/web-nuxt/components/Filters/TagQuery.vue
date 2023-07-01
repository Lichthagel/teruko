<script setup lang="ts">
import { gql, useQuery } from "@urql/vue";
import { X } from "lucide-vue-next";
import { TagExt } from "models";

const route = useRoute();

const props = defineProps<{
  tag: string;
}>();

const result = useQuery<{ tag: TagExt }>({
  query: gql`
    query Tag($slug: String!) {
      tag(slug: $slug) {
        category {
          color
        }
      }
    }
  `,
  variables: { slug: props.tag },
});

const removeTag = () => {
  navigateTo({
    query: {
      ...route.query,
      tag: Array.isArray(route.query.tag)
        ? route.query.tag.filter((tag) => tag !== props.tag)
        : undefined,
    },
  });
};
</script>

<template>
  <div
    class="m-0.5 flex h-10 select-none items-center whitespace-nowrap rounded bg-gray-500 px-2 text-white"
    :style="{
      backgroundColor: result.data.value?.tag?.category?.color ?? undefined,
    }"
  >
    <span class="mx-1">{{ props.tag }}</span>
    <button
      class="mx-1 rounded transition hover:bg-black/20"
      @click="removeTag"
    >
      <X />
    </button>
  </div>
</template>

<!-- TODO status bar -->