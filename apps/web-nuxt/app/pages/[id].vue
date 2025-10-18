<script setup lang="ts">
import type { ImageExt } from "models";

import { gql, useQuery } from "@urql/vue";
import styles from "client-css/m/imagepage.module.scss";
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
  data,
  fetching,
  stale,
  error,
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
      v-if="data && data.image"
    >
      <img
        :class="styles.image"
        :src="`/img/${data.image.filename}`"
        @load="scroll"
      >

      <div class="container">
        <div :class="styles['meta-container']">
          <div :class="styles['meta-title']">
            <h1>
              {{ data.image.title }}
            </h1>

            <span>
              Source:
              <NuxtLink
                v-if="data.image.source"
                :href="data.image.source"
                target="_blank"
              >
                {{ data.image.source }}
              </NuxtLink>
              <span v-else>unknown</span>
            </span>
          </div>

          <div :class="styles['meta-rest']">
            <div :class="styles['meta-dates']">
              <div>
                <span>Created At: </span>
                {{ new Date(data.image.createdAt).toLocaleString() }}
              </div>
              <div>
                <span>Updated At: </span>
                {{ new Date(data.image.updatedAt).toLocaleString() }}
              </div>
            </div>

            <NuxtLink
              :class="styles['meta-dlicon']"
              :external="true"
              :href="`/${data.image.id}/original`"
            >
              <DownloadIcon :class="styles.icon" />
              <span>
                {{ fileExt }}
              </span>
            </NuxtLink>

            <NuxtLink
              v-if="!!fileExt && fileExt !== 'avif'"
              :class="styles['meta-dlicon']"
              :external="true"
              :href="`/${data.image.id}/avif`"
            >
              <DownloadIcon :class="styles.icon" />
              <span>
                avif
              </span>
            </NuxtLink>

            <NuxtLink
              :class="styles['meta-dlicon']"
              :external="true"
              :href="`/${data.image.id}/webp`"
            >
              <DownloadIcon :class="styles.icon" />
              <span>
                webp
              </span>
            </NuxtLink>
          </div>
        </div>

        <div :class="styles.tags">
          <TagChip
            v-for="tag in data.image.tags"
            :key="tag.slug"
            :tag="tag"
          />
        </div>
      </div>
    </div>

    <ErrorMessage
      v-if="error"
      :message="error.message"
      :title="error.name"
    />

    <ErrorMessage
      v-if="!fetching && !error && (!data || !data.image)"
      title="Not Found"
    />

    <StatusBar
      :error="!!error"
      :fetching="fetching || stale"
    />
  </div>
</template>
