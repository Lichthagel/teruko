<script setup lang="ts">
import { ChevronUp, ChevronDown } from "lucide-vue-next";

const showToTop = ref(false);
const showToBottom = ref(false);

const onScroll = () => {
  showToTop.value = window.scrollY > 50;
  showToBottom.value =
    window.scrollY + window.innerHeight <
    window.document.body.scrollHeight - 50;
};

const scrollToTop = () => {
  window.scrollTo({ behavior: "smooth", top: 0 });
};

const scrollToBottom = () => {
  window.scrollTo({
    behavior: "smooth",
    top: window.document.body.scrollHeight,
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
  <div class="join fixed bottom-3 right-3 z-10 bg-base-100">
    <button
      class="btn btn-square btn-ghost"
      :class="{ hidden: !showToTop }"
      @click="scrollToTop"
    >
      <ChevronUp />
    </button>
    <button
      class="btn btn-square btn-ghost"
      :class="{ hidden: !showToBottom }"
      @click="scrollToBottom"
    >
      <ChevronDown />
    </button>
  </div>
</template>
