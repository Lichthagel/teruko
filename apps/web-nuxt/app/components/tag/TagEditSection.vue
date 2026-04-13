<script setup lang="ts">
import { Save } from "@lucide/vue";
import { useMutation, useQuery } from "@urql/vue";
import styles from "client-css/m/tag.module.scss";
import { TagEdit, UpdateTag } from "client-graphql/snippets";
import Button from "../common/Button.vue";
import Checkbox from "../common/Checkbox.vue";
import Input from "../common/Input.vue";
import Select from "../common/Select.vue";
import SkeletonLoader from "../common/SkeletonLoader.vue";

const props = defineProps<{
  slug: string;
}>();
const emit = defineEmits<{
  (e: "afterUpdate", newSlug?: string): void;
}>();

const { data, fetching } = useQuery({
  query: TagEdit,
  variables: { slug: props.slug },
});

const slugInput = ref(props.slug);
const categoryInput = ref<string | undefined>(data.value?.tag?.category?.slug);
const approvedInput = ref(data.value?.tag?.approved);

watch(() => props.slug, value => slugInput.value = value);

watch(data, (v) => {
  categoryInput.value = v?.tag?.category?.slug;
  approvedInput.value = v?.tag?.approved;
});

const { fetching: fetchingUpdateTag, executeMutation: updateTag_ } = useMutation(UpdateTag);
const updateTag = () => updateTag_({
  slug: props.slug,
  newSlug: slugInput.value,
  category: categoryInput.value,
  approved: approvedInput.value,
}).then((res) => {
  if (res.data?.updateTag) {
    emit("afterUpdate", res.data.updateTag.slug);
  }
});
</script>

<template>
  <h1>Meta</h1>

  <SkeletonLoader v-if="fetching" />
  <div v-else :class="styles.content">
    <div :class="styles.row">
      <Input v-model="slugInput" />
      <Select
        v-model="categoryInput"
        :options="data?.tagCategories.map(v => v.slug) ?? []"
      />
    </div>
    <div :class="styles.row">
      <Checkbox v-model:checked="approvedInput" label="approved" />
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
  </div>
</template>
