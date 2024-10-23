<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import styles from "client-css/m/filters.module.scss";
import { tagsStore } from "client-stores";
import { Loader2, Search } from "lucide-vue-next";

import { useSuggestions } from "#imports";

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
    case "ArrowDown": {
      e.preventDefault();
      activeSuggestion.value
        = (activeSuggestion.value + 1) % suggestions.value.length;

      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      activeSuggestion.value
        = (activeSuggestion.value - 1 + suggestions.value.length)
        % suggestions.value.length;

      break;
    }
    case "Enter": {
      handleSubmit();

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
  <div :class="styles['search-container']">
    <Search />

    <input
      @keydown="handleKeyDown"
      placeholder="Search..."
      type="text"
      v-model="tagInput"
    >
    <div
      :class="styles['suggestions-loading']"
      v-if="fetching"
    >
      <Loader2 :class="styles.icon" />
    </div>
    <ul
      :class="styles['suggestions-container']"
      v-if="suggestions.length > 0"
    >
      <li
        :class="index === activeSuggestion && styles.active"
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
        v-for="(suggestion, index) in suggestions"
      >
        {{ suggestion.slug }}
      </li>
    </ul>
  </div>
</template>
