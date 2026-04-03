<script setup lang="ts">
import { X } from "@lucide/vue";
import { useQuery } from "@urql/vue";
import styles from "client-css/m/filters.module.scss";
import { Tag } from "client-graphql/snippets";

const props = defineProps<{
  tag: string;
}>();

const { tags } = useFilters();

const {
  data,
  fetching,
  stale,
  error,
} = useQuery({
  query: Tag,
  variables: { slug: props.tag },
});

const removeTag = () => {
  tags.value = tags.value.filter(tag => tag !== props.tag);
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
      type="button"
      @click="removeTag"
    >
      <X />
    </button>
  </div>

  <StatusBar
    :error="!!error"
    :fetching="fetching || stale"
  />
</template>
