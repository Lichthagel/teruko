<script setup lang="ts">
import styles from "client-css/m/form.module.scss";

useHead({ title: "Account - てる子" });

const { error: loadError } = await useFetch("/api/settings/tokens", {
  key: "userscript-tokens",
  cache: "no-store",
});
const secret = ref("");
const error = ref("");
const busy = ref(false);
if (loadError.value)
  error.value = loadError.value.message;

const createToken = async () => {
  busy.value = true;
  error.value = "";
  try {
    const result = await $fetch<{ id: string; token: string }>("/api/settings/tokens", { method: "POST" });
    secret.value = result.token;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause);
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <CommonPageLayout title="Account">
    <CommonPanel id="token-heading" title="Token">
      <div :class="styles.actionRow">
        <CommonLoadingButton :loading="busy" loading-label="Regenerating token" @click="createToken">
          Regenerate
        </CommonLoadingButton>
      </div>
      <CommonCopyableSecret v-if="secret" :value="secret" label="Token" />
      <p v-if="error" :class="styles.formError" role="alert">
        {{ error }}
      </p>
    </CommonPanel>
  </CommonPageLayout>
</template>
