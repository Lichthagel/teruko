<script setup lang="ts">
import styles from "client-css/m/scrollbuttons.module.scss";
import { ChevronDown, ChevronUp } from "lucide-vue-next";

const showToTop = ref(false);
const showToBottom = ref(false);

const onScroll = () => {
  showToTop.value = window.scrollY > 50;
  showToBottom.value
    = window.scrollY + window.innerHeight
      < globalThis.document.body.scrollHeight - 50;
};

const scrollToTop = () => {
  window.scrollTo({ behavior: "smooth", top: 0 });
};

const scrollToBottom = () => {
  window.scrollTo({
    behavior: "smooth",
    top: globalThis.document.body.scrollHeight,
  });
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <div :class="styles.buttons">
    <button
      :class="!showToTop && styles.hidden"
      @click="scrollToTop"
      type="button"
    >
      <ChevronUp />
    </button>
    <button
      :class="!showToBottom && styles.hidden"
      @click="scrollToBottom"
      type="button"
    >
      <ChevronDown />
    </button>
  </div>
</template>
