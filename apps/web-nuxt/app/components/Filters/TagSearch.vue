<script setup lang="ts">
import { useSuggestions } from "#imports";
import { Loader2, Search } from "@lucide/vue";
import styles from "client-css/m/filters.module.scss";

const { tags } = useFilters();

const tagInput = ref("");
const activeSuggestion = ref(0);

const { fetching, suggestions } = useSuggestions(tagInput); // TODO handle error

const handleSubmit = () => {
  if (suggestions.value.length === 0) {
    return;
  }

  const activeValue = suggestions.value[activeSuggestion.value];

  if (activeValue) {
    tags.value = [...tags.value, activeValue.slug];
    tagInput.value = "";
    activeSuggestion.value = 0;
  }
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
      tags.value = [];

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
      v-model="tagInput"
      placeholder="Search..."
      type="text"
      @keydown="handleKeyDown"
    >
    <div
      v-if="fetching"
      :class="styles['suggestions-loading']"
    >
      <Loader2 :class="styles.icon" />
    </div>
    <ul
      v-if="suggestions.length > 0"
      :class="styles['suggestions-container']"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.slug"
        :class="index === activeSuggestion && styles.active"
        :style="{
          'background-color':
            (index === activeSuggestion
              && suggestion.category
              && suggestion.category.color)
            || undefined,
          'color':
            (index !== activeSuggestion
              && suggestion.category
              && suggestion.category.color)
            || undefined,
        }"
        @click="handleSubmit"
        @mouseenter="activeSuggestion = index"
      >
        {{ suggestion.slug }}
      </li>
    </ul>
  </div>
</template>
