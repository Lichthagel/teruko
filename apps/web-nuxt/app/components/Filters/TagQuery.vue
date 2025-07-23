<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { gql, useQuery } from "@urql/vue";
import styles from "client-css/m/filters.module.scss";
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
    :class="styles['tag-query']"
    :style="{
      backgroundColor: data?.tag?.category?.color ?? undefined,
    }"
  >
    <span>{{ props.tag }}</span>
    <button
      @click="removeTag"
      type="button"
    >
      <X />
    </button>
  </div>

  <StatusBar
    :error="!!error"
    :fetching="fetching || stale"
  />
</template>
