<script setup lang="ts">
import { DownloadIcon } from "@lucide/vue";
import { useClientHandle, useQuery } from "@urql/vue";
import styles from "client-css/m/imagepage.module.scss";
import { createImageNavigation } from "client-graphql/gallery";
import { Image } from "client-graphql/snippets";

const route = useRoute();

const { client } = useClientHandle();
const navigation = createImageNavigation(client, () => Number(route.params.id), id => navigateTo(`/${id}`));
const progress = shallowRef(navigation.getSnapshot());
const navigationState = computed(() => navigation.getState(progress.value));
let unsubscribe: (() => void) | undefined;
onMounted(() => {
  unsubscribe = navigation.subscribe(() => {
    progress.value = navigation.getSnapshot();
  });
  window.addEventListener("keydown", navigation.keydown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", navigation.keydown);
  unsubscribe?.();
  navigation.dispose();
});

const result = useQuery({
  query: Image,
  variables: computed(() => ({
    id: Number.parseInt(route.params.id as string),
  })),
});

const {
  data,
  fetching,
  stale,
  error,
} = result;

const fileExt = computed<string | null>(() => data.value?.image?.filename
  ? (data.value.image.filename.split(".").pop() ?? null)
  : null);

const scroll = (payload: Event) => {
  (payload.target as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

useHead({
  title: computed(
    () =>
      `${data.value?.image?.title
        ? `${data.value.image.title} - `
        : ""}てる子`,
  ),
});
</script>

<template>
  <div>
    <div :class="styles.viewer" :data-image-id="data?.image?.id" :aria-busy="navigationState.loading">
      <button type="button" aria-label="Previous image" data-direction="previous" :disabled="!navigationState.canPrevious" @click="navigation.previous()">
        &lt;
      </button>
      <button type="button" aria-label="Next image" data-direction="next" :disabled="!navigationState.canNext" @click="navigation.next()">
        <img v-if="data?.image" :class="styles.image" :src="`/img/${data.image.filename}`" :alt="data.image.title ?? data.image.filename" @load="scroll">
      </button>
      <button type="button" aria-label="Next image" data-direction="next" :disabled="!navigationState.canNext" @click="navigation.next()">
        &gt;
      </button>
      <span role="status">{{ navigationState.error }}</span>
    </div>
    <div
      v-if="data && data.image"
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
