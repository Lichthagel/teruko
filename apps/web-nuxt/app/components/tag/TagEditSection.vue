<script setup lang="ts">
import { Save } from "@lucide/vue";
import { useMutation, useQuery } from "@urql/vue";
import styles from "client-css/m/tag.module.scss";
import { TagEdit, UpdateTag } from "client-graphql/snippets";
import Button from "../common/Button.vue";
import Input from "../common/Input.vue";
import Select from "../common/Select.vue";

const props = defineProps<{
  slug: string;
}>();
const emit = defineEmits<{
  (e: "afterUpdate", newSlug?: string): void;
}>();

const { data } = useQuery({
  query: TagEdit,
  variables: { slug: props.slug },
});

const slugInput = ref(props.slug);
const categoryInput = ref<string | undefined>(data.value?.tag?.category?.slug);

watch(() => props.slug, value => slugInput.value = value);

watch(data, v => categoryInput.value = v?.tag?.category?.slug);

const { data: dataUpdateTag, fetching: fetchingUpdateTag, executeMutation: updateTag_ } = useMutation(UpdateTag);
const updateTag = () => updateTag_({ slug: props.slug, newSlug: slugInput.value, category: categoryInput.value });

watch(dataUpdateTag, (v) => {
  if (v?.updateTag) {
    emit("afterUpdate", v.updateTag.slug);
  }
});
</script>

<template>
  <h1>Meta</h1>

  <div :class="styles.row">
    <Input v-model="slugInput" />
    <Select
      v-model="categoryInput"
      :options="data?.tagCategories.map(v => v.slug) ?? []"
    />
    <Button
      :style="{ flexGrow: 0 }"
      :icon="Save"
      :disabled="fetchingUpdateTag"
      @click="(e: MouseEvent) => {
        e.preventDefault();
        updateTag();
      }"
    />
  </div>
</template>
