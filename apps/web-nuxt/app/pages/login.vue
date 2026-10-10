<script setup lang="ts">
import styles from "client-css/m/login.module.scss";

useHead({ title: "Sign in - てる子" });

const route = useRoute();
const returnTo = computed(() => typeof route.query.returnTo === "string" ? route.query.returnTo : "/");
const loginUrl = computed(() => `/auth/login?returnTo=${encodeURIComponent(returnTo.value)}`);
</script>

<template>
  <main :class="styles.page">
    <div :class="styles.eyebrow">
      てる子 / Pixiv archive
    </div>
    <h1 :class="styles.title">
      A quieter way to browse.
    </h1>
    <p :class="styles.intro">
      Sign in with your organization account to continue to the illustration archive.
    </p>
    <section :class="styles.card" aria-labelledby="signin-title">
      <h2 id="signin-title" :class="styles.cardTitle">
        Welcome back
      </h2>
      <p :class="styles.cardText">
        Your collection is waiting. Authentication is handled securely by your organization.
      </p>
      <a :class="styles.button" :href="loginUrl">Continue with Authentik</a>
    </section>
  </main>
</template>
