<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

const { tags, setTags } = useFilters();

const tagInput = ref("");
const activeSuggestion = ref(0);

const { fetching, suggestions } = useSuggestions(tagInput); // TODO handle error

const handleSubmit = () => {
  if (suggestions.value.length === 0) return;

  tagInput.value = "";
  activeSuggestion.value = 0;
  setTags([...tags.value, suggestions.value[activeSuggestion.value].slug]);
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
      setTags(undefined);

      break;
    }
    // No default
  }
};
</script>

<template>
  <div class="relative inline-block">
    <input
      v-model="tagInput"
      placeholder="Search..."
      class="h-10 rounded bg-base-100 px-2 focus:outline-none"
      type="text"
      @keydown="handleKeyDown"
    />
    <div
      v-if="fetching"
      class="absolute left-0 right-0 z-20 flex h-20 items-center justify-center bg-base-100 p-1"
    >
      <Loader2 class="h-14 w-14 animate-spin" />
    </div>
    <ul
      v-if="suggestions.length > 0"
      class="absolute left-0 right-0 z-20 block bg-base-100 p-1"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.slug"
        :class="{
          'bg-primary text-primary-content': index === activeSuggestion,
          'bg-neutral text-neutral-content': index !== activeSuggestion,
        }"
        class="my-1 h-10 cursor-pointer truncate rounded p-2"
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
      >
        {{ suggestion.slug }}
      </li>
    </ul>
  </div>
</template>
