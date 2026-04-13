<script setup lang="ts">
import { BadgeCheck, Pencil, X } from "@lucide/vue";
import { useQuery } from "@urql/vue";
import styles from "client-css/m/filters.module.scss";
import { Tag } from "client-graphql/snippets";

const props = defineProps<{
  tag: string;
}>();

const { tags } = useFilters();

const dialogOpen = ref(false);

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
    <BadgeCheck v-if="data?.tag.approved" :size="16" />
    <button
      type="button"
      @click="dialogOpen = true"
    >
      <Pencil />
    </button>
    <button
      type="button"
      @click="removeTag"
    >
      <X />
    </button>
  </div>

  <TagDialog v-model:open=" dialogOpen " :slug="tag" />

  <StatusBar
    :error="!!error"
    :fetching="fetching || stale"
  />
</template>
