<script setup lang="ts">
import styles from "client-css/m/dialog.module.scss";

const { class: className } = defineProps<{ class?: string }>();
const open = defineModel("open", {
  default: false,
});

const dialogRef = useTemplateRef("dialog");

watchEffect(() => {
  if (dialogRef.value) {
    if (open.value) {
      dialogRef.value.showModal();
    } else {
      dialogRef.value.close();
    }
  }
});
</script>

<template>
  <dialog v-if="open" ref="dialog" :class="`${className} ${styles.dialog}`" closedby="any" onclose="() => {open = false}">
    <slot />
  </dialog>
</template>
