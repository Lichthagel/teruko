<script setup lang="ts">
import type { ImageExt } from "models";

import { gql, useQuery } from "@urql/vue";
import { DownloadIcon } from "lucide-vue-next";

const route = useRoute();

const id = route.params.id as string;

const result = useQuery<{ image: ImageExt | null }>({
  query: gql`
    query Image($id: ID!) {
      image(id: $id) {
        id
        title
        source
        filename
        createdAt
        updatedAt
        tags {
          slug
          category {
            color
          }
        }
      }
    }
  `,
  variables: {
    id,
  },
});

const {
  data, fetching, stale, error,
} = result;

const fileExt = computed<string | null>(() => data.value?.image?.filename ? (data.value.image.filename.split(".").pop() ?? null) : null);

const scroll = (payload: Event) => {
  (payload.target as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

useHead({
  title: computed(
    () =>
      `${data.value?.image?.title ? `${data.value.image.title} - ` : ""}てる子`,
  ),
});
</script>

<template>
  <div>
    <div
      class="space-y-1"
      v-if="data && data.image"
    >
      <img
        :src="`/img/${data.image.filename}`"
        @load="scroll"
        class="mx-auto max-h-screen"
      >

      <div class="container mx-auto pb-12">
        <div class="my-4 w-full p-1 lg:flex">
          <div class="overflow-hidden lg:flex-grow">
            <h1 class="text-3xl">
              {{ data.image.title }}
            </h1>

            <span class="text-sm">
              Source:
              <NuxtLink
                :href="data.image.source"
                class="link"
                target="_blank"
                v-if="data.image.source"
              >
                {{ data.image.source }}
              </NuxtLink>
              <span v-else>unknown</span>
            </span>
          </div>

          <div class="flex items-center lg:flex-shrink-0">
            <div
              class="my-1 flex-grow text-xs lg:mx-2 lg:text-right lg:text-sm"
            >
              <div>
                <span class="font-light">Created At: </span>
                {{ new Date(data.image.createdAt).toLocaleString() }}
              </div>
              <div>
                <span class="font-light">Updated At: </span>
                {{ new Date(data.image.updatedAt).toLocaleString() }}
              </div>
            </div>

            <NuxtLink
              :external="true"
              :href="`/${data.image.id}/original`"
              class="relative pb-2"
            >
              <DownloadIcon class="mx-1 h-10 w-10" />
              <span
                class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
              >
                {{ fileExt }}
              </span>
            </NuxtLink>

            <NuxtLink
              :external="true"
              :href="`/${data.image.id}/avif`"
              class="relative pb-2"
              v-if="!!fileExt && fileExt !== 'avif'"
            >
              <DownloadIcon class="mx-1 h-10 w-10" />
              <span
                class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
              >
                avif
              </span>
            </NuxtLink>

            <NuxtLink
              :external="true"
              :href="`/${data.image.id}/webp`"
              class="relative pb-2"
            >
              <DownloadIcon class="mx-1 h-10 w-10" />
              <span
                class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
              >
                webp
              </span>
            </NuxtLink>
          </div>
        </div>

        <div class="w-full text-center lg:text-start">
          <TagChip
            :key="tag.slug"
            :tag="tag"
            v-for="tag in data.image.tags"
          />
        </div>
      </div>
    </div>

    <ErrorMessage
      :message="error.message"
      :title="error.name"
      v-if="error"
    />

    <ErrorMessage
      title="Not Found"
      v-if="!fetching && !error && (!data || !data.image)"
    />

    <StatusBar
      :error="!!error"
      :fetching="fetching || stale"
    />
  </div>
</template>
