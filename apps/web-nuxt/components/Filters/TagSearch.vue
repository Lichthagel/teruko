<script setup lang="ts">
import { useSuggestions } from "#imports";
import { useStore } from "@nanostores/vue";
import { tagsStore } from "client-common/stores";
import { Loader2 } from "lucide-vue-next";

const tags = useStore(tagsStore);

const tagInput = ref("");
const activeSuggestion = ref(0);

const { fetching, suggestions } = useSuggestions(tagInput); // TODO handle error

const handleSubmit = () => {
  if (suggestions.value.length === 0) {
    return;
  }

  tagsStore.set([...tags.value, suggestions.value[activeSuggestion.value].slug]);
  tagInput.value = "";
  activeSuggestion.value = 0;
};

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "Enter": {
      handleSubmit();

      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      activeSuggestion.value =
        (activeSuggestion.value - 1 + suggestions.value.length) %
        suggestions.value.length;

      break;
    }
    case "ArrowDown": {
      e.preventDefault();
      activeSuggestion.value =
        (activeSuggestion.value + 1) % suggestions.value.length;

      break;
    }
    case "Escape": {
      tagInput.value = "";
      activeSuggestion.value = 0;
      tagsStore.set([]);

      break;
    }
    // No default
  }
};
</script>

<template>
  <div class="relative inline-block">
    <input
      @keydown="handleKeyDown"
      class="h-10 rounded bg-base-100 px-2 focus:outline-none"
      placeholder="Search..."
      type="text"
      v-model="tagInput"
    >
    <div
      class="absolute left-0 right-0 z-20 flex h-20 items-center justify-center bg-base-100 p-1"
      v-if="fetching"
    >
      <Loader2 class="h-14 w-14 animate-spin" />
    </div>
    <ul
      class="absolute left-0 right-0 z-20 block bg-base-100 p-1"
      v-if="suggestions.length > 0"
    >
      <li
        :class="{
          'bg-primary text-primary-content': index === activeSuggestion,
          'bg-neutral text-neutral-content': index !== activeSuggestion,
        }"
        :key="suggestion.slug"
        :style="{
          'background-color':
            (index === activeSuggestion &&
              suggestion.category &&
              suggestion.category.color) ||
            undefined,
          'color':
            (index !== activeSuggestion &&
              suggestion.category &&
              suggestion.category.color) ||
            undefined,
        }"
        @click="handleSubmit"
        @mouseenter="activeSuggestion = index"
        class="my-1 h-10 cursor-pointer truncate rounded p-2"
        v-for="(suggestion, index) in suggestions"
      >
        {{ suggestion.slug }}
      </li>
    </ul>
  </div>
</template>
