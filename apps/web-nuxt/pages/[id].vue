<script setup lang="ts">
import { gql, useQuery } from "@urql/vue";
import { DownloadIcon } from "lucide-vue-next";

const route = useRoute();

const id = route.params.id as string;

const result = useQuery({
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

const { data, fetching, stale, error } = result;

const fileExt = computed(() => {
  if (data.value?.image.filename) {
    return data.value.image.filename.split(".").pop();
  }
});

const scroll = (payload: Event) => {
  (payload.target as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

useHead({
  title: computed(
    () =>
      `${data.value?.image?.title ? `${data.value.image.title} - ` : ""}てる子`
  ),
});
</script>

<template>
  <div>
    <div v-if="data && data.image" class="space-y-1">
      <img
        :src="`/img/${data.image.filename}`"
        class="mx-auto max-h-screen"
        @load="scroll"
      />

      <div class="container mx-auto pb-12">
        <div class="my-4 w-full p-1 lg:flex">
          <div class="overflow-hidden lg:flex-grow">
            <h1 class="text-3xl">{{ data.image.title }}</h1>

            <span class="text-sm">
              Source:
              <NuxtLink :href="data.image.source" target="_blank" class="link">
                {{ data.image.source }}
              </NuxtLink>
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
              class="relative pb-2"
              :href="`/${data.image.id}/original`"
              :external="true"
            >
              <DownloadIcon class="mx-1 h-10 w-10" />
              <span
                class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
              >
                {{ fileExt }}
              </span>
            </NuxtLink>

            <NuxtLink
              v-if="!!fileExt && fileExt !== 'avif'"
              class="relative pb-2"
              :href="`/${data.image.id}/avif`"
              :external="true"
            >
              <DownloadIcon class="mx-1 h-10 w-10" />
              <span
                class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
              >
                avif
              </span>
            </NuxtLink>

            <NuxtLink
              class="relative pb-2"
              :href="`/${data.image.id}/webp`"
              :external="true"
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
          <TagChip v-for="tag in data.image.tags" :key="tag.slug" :tag="tag" />
        </div>
      </div>
    </div>

    <ErrorMessage v-if="error" :title="error.name" :message="error.message" />

    <ErrorMessage v-if="!fetching && !error && !data.image" title="Not Found" />

    <StatusBar :fetching="fetching || stale" :error="!!error" />
  </div>
</template>
