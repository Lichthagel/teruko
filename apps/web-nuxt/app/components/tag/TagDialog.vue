<script setup lang="ts">
import styles from "client-css/m/tag.module.scss";
import Dialog from "../common/Dialog.vue";

defineProps<{ slug: string }>();
const open = defineModel("open", {
  default: false,
});
</script>

<template>
  <Dialog v-model:open="open" :class="styles['tag-dialog']">
    <!-- <TagEditSection {slug} on-submit="{onSubmit}" /> -->
    hello {{ slug }}
  </Dialog>
</template>
