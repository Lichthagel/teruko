<script setup lang="ts">
import { Plus } from "lucide-vue-next";
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="container mx-auto">
      <div class="flex-1">
        <NuxtLink class="btn-ghost btn text-xl normal-case" href="/">
          てる子
        </NuxtLink>
      </div>
      <div class="flex-none">
        <NuxtLink class="btn-ghost btn-square btn" href="/new">
          <Plus />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
