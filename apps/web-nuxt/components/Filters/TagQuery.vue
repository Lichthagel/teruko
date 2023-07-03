<script setup lang="ts">
import { gql, useQuery } from "@urql/vue";
import { X } from "lucide-vue-next";
import { TagExt } from "models";
import { useStore } from "@nanostores/vue";
import { tagsStore } from "client-common/stores";

const tags = useStore(tagsStore);

const props = defineProps<{
  tag: string;
}>();

const { data, fetching, stale, error } = useQuery<{ tag: TagExt }>({
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
    class="m-0.5 flex h-10 select-none items-center whitespace-nowrap rounded bg-gray-500 px-2 text-white"
    :style="{
      backgroundColor: data?.tag?.category?.color ?? undefined,
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

  <StatusBar :fetching="fetching || stale" :error="!!error" />
</template>
