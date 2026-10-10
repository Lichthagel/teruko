<script setup lang="ts">
import styles from "client-css/m/tokens.module.scss";

type TokenStatus = { active: boolean; createdAt: string | null };
type TokenResponse = TokenStatus;

useHead({ title: "Userscript access - てる子" });

const { data, refresh, error: loadError } = await useFetch<TokenResponse>("/api/settings/tokens", {
  key: "userscript-tokens",
  cache: "no-store",
});
const secret = ref("");
const error = ref("");
const busy = ref(false);
if (loadError.value) {
  if (loadError.value.statusCode === 401) {
    await navigateTo(`/login?returnTo=${encodeURIComponent("/settings/tokens")}`);
  }
  error.value = loadError.value.message;
}

const createToken = async () => {
  busy.value = true;
  error.value = "";
  try {
    const result = await $fetch<{ id: string; token: string }>("/api/settings/tokens", { method: "POST" });
    secret.value = result.token;
    await refresh();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause);
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <main :class="styles.page">
    <div :class="styles.eyebrow">
      Account settings
    </div>
    <h1 :class="styles.title">
      Userscript access
    </h1>
    <p :class="styles.intro">
      Generate a bearer token for the Pixiv userscript, then paste it into your userscript settings. The secret appears only once.
    </p>

    <section :class="styles.card" aria-labelledby="create-heading">
      <h2 id="create-heading" :class="styles.sectionTitle">
        Personal access
      </h2>
      <p :class="styles.muted">
        Treat this token like a password. Generating a replacement immediately invalidates the previous one.
      </p>
      <div :class="styles.actions">
        <button :class="styles.primaryButton" type="button" :disabled="busy" @click="createToken">
          {{ busy ? "Working..." : "Generate / reset token" }}
        </button>
      </div>
      <div v-if="secret">
        <div :class="styles.notice" role="status">
          Copy this secret now. It will not be displayed again.
        </div>
        <pre :class="styles.tokenSecret" aria-label="New bearer token">{{ secret }}</pre>
      </div>
      <p v-if="error" :class="styles.error" role="alert">
        {{ error }}
      </p>
    </section>

    <section :class="styles.card" aria-labelledby="tokens-heading">
      <h2 id="tokens-heading" :class="styles.sectionTitle">
        Current userscript token
      </h2>
      <p v-if="data?.active" :class="styles.muted">
        An active token was generated{{ data.createdAt ? ` on ${data.createdAt.slice(0, 16).replace("T", " ")} UTC` : "" }}. Generate a new one to invalidate and replace it.
      </p>
      <p v-else :class="styles.muted">
        No active token. Generate one to connect the userscript.
      </p>
    </section>

    <div :class="styles.footer">
      <form method="post" action="/auth/logout">
        <button :class="styles.secondaryButton" type="submit">
          Sign out
        </button>
      </form>
    </div>
  </main>
</template>
