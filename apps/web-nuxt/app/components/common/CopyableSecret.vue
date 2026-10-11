<script setup lang="ts">
import { Check, Copy } from "@lucide/vue";
import styles from "client-css/m/form.module.scss";

const props = withDefaults(defineProps<{ value: string; label?: string }>(), { label: "Secret" });
const copied = ref(false);
const error = ref("");

watch(() => props.value, () => {
  copied.value = false;
  error.value = "";
});

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    error.value = "";
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause);
  }
};
</script>

<template>
  <div :class="styles.secretField">
    <input :class="styles.maskedInput" type="text" :aria-label="label" :value="value" readonly>
    <button :class="[styles.buttonSecondary, styles.copyButton]" type="button" :aria-label="copied ? 'Copied' : 'Copy token'" @click="copy">
      <component :is="copied ? Check : Copy" :class="styles.copyIcon" aria-hidden="true" />
    </button>
  </div>
  <p v-if="error" :class="styles.formError" role="alert">
    {{ error }}
  </p>
</template>
