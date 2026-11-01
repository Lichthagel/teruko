<script setup lang="ts">
import { Plus, User } from "@lucide/vue";
import styles from "client-css/m/nav.module.scss";
</script>

<template>
  <div :class="styles.bar">
    <div class="container" :class="[styles.content]">
      <div :class="styles.left">
        <NuxtLink
          :class="styles.button"
          href="/"
        >
          てる子
        </NuxtLink>
      </div>
      <div>
        <NuxtLink :class="[styles.button, styles.square]" href="/account" aria-label="Account" title="Account">
          <User :size="20" />
        </NuxtLink>
        <NuxtLink
          :class="[styles.button, styles.square]"
          href="/new"
        >
          <Plus />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
