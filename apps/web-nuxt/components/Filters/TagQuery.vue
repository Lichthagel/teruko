<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { gql, useQuery } from "@urql/vue";
import { tagsStore } from "client-stores";
import { X } from "lucide-vue-next";
import { type TagExt } from "models";

const tags = useStore(tagsStore);

const props = defineProps<{
  tag: string;
}>();

const {
  data, fetching, stale, error,
} = useQuery<{ tag: TagExt }>({
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
  tagsStore.set(tags.value.filter((tag) => tag !== props.tag));
};
</script>

<template>
  <div
    :style="{
      backgroundColor: data?.tag?.category?.color ?? undefined,
    }"
    class="m-0.5 flex h-10 select-none items-center whitespace-nowrap rounded bg-gray-500 px-2 text-white"
  >
    <span class="mx-1">{{ props.tag }}</span>
    <button
      @click="removeTag"
      class="mx-1 rounded transition hover:bg-black/20"
    >
      <X />
    </button>
  </div>

  <StatusBar
    :error="!!error"
    :fetching="fetching || stale"
  />
</template>
