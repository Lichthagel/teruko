<script setup lang="ts">
import styles from "client-css/m/nav.module.scss";
import { Plus } from "lucide-vue-next";
</script>

<template>
  <div :class="styles.bar">
    <div :class="['container', styles.content]">
      <div :class="styles.left">
        <NuxtLink
          :class="styles.button"
          href="/"
        >
          てる子
        </NuxtLink>
      </div>
      <div>
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
